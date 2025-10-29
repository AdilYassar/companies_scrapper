const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const config = require('../../src/config');

class DatabaseInitializer {
  constructor() {
    this.supabase = createClient(config.supabase.url, config.supabase.serviceKey);
  }
  
  async initialize() {
    try {
      console.log('🚀 Initializing database...');
      
      // Run migrations
      await this.runMigrations();
      
      // Seed initial data
      await this.seedInitialData();
      
      console.log('✅ Database initialization completed successfully!');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }
  
  async runMigrations() {
    console.log('📝 Running database migrations...');
    
    const migrationsDir = path.join(__dirname, '../../supabase/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    for (const file of migrationFiles) {
      console.log(`  Running migration: ${file}`);
      
      const migrationSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      try {
        const { error } = await this.supabase.rpc('exec_sql', { sql: migrationSQL });
        if (error) {
          console.warn(`  Warning: ${file} - ${error.message}`);
        } else {
          console.log(`  ✅ ${file} completed`);
        }
      } catch (error) {
        console.warn(`  Warning: ${file} - ${error.message}`);
      }
    }
  }
  
  async seedInitialData() {
    console.log('🌱 Seeding initial data...');
    
    // Seed data sources
    await this.seedDataSources();
    
    console.log('✅ Initial data seeded');
  }
  
  async seedDataSources() {
    const dataSources = [
      {
        name: 'pagine_gialle',
        display_name: 'Pagine Gialle',
        country: 'IT',
        url: 'https://www.paginegialle.it',
        platform_type: 'directory',
        scraper_class: 'PagineGialleScraper',
        scraper_strategy: 'static',
        requires_auth: false,
        rate_limit_per_minute: 60,
        is_active: true,
        scraping_frequency: 'weekly'
      },
      {
        name: 'registro_imprese',
        display_name: 'Registro Imprese',
        country: 'IT',
        url: 'https://www.registroimprese.it',
        platform_type: 'registry',
        scraper_class: 'RegistroImpreseScraper',
        scraper_strategy: 'dynamic',
        requires_auth: false,
        rate_limit_per_minute: 30,
        is_active: true,
        scraping_frequency: 'monthly'
      },
      {
        name: 'listafirme',
        display_name: 'Lista Firme',
        country: 'RO',
        url: 'https://www.listafirme.ro',
        platform_type: 'directory',
        scraper_class: 'ListaFirmeScraper',
        scraper_strategy: 'static',
        requires_auth: false,
        rate_limit_per_minute: 60,
        is_active: true,
        scraping_frequency: 'weekly'
      },
      {
        name: 'onrc',
        display_name: 'ONRC - Romanian Trade Registry',
        country: 'RO',
        url: 'https://www.onrc.ro',
        platform_type: 'registry',
        scraper_class: 'ONRCScraper',
        scraper_strategy: 'dynamic',
        requires_auth: false,
        rate_limit_per_minute: 30,
        is_active: true,
        scraping_frequency: 'monthly'
      },
    ];
    
    for (const source of dataSources) {
      try {
        const { error } = await this.supabase
          .from('data_sources')
          .upsert(source, { onConflict: 'name' });
        
        if (error) {
          console.warn(`  Warning: Failed to seed ${source.name} - ${error.message}`);
        } else {
          console.log(`  ✅ Seeded ${source.name}`);
        }
      } catch (error) {
        console.warn(`  Warning: Failed to seed ${source.name} - ${error.message}`);
      }
    }
  }
}

// Run initialization if called directly
if (require.main === module) {
  const initializer = new DatabaseInitializer();
  initializer.initialize()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = DatabaseInitializer;
