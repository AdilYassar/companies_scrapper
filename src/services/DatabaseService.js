const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

class DatabaseService {
  constructor() {
    this.supabase = createClient(config.supabase.url, config.supabase.serviceKey);
  }

  async storeCompanies(companies) {
    try {
      console.log(`💾 Storing ${companies.length} companies to database...`);
      
      // Prepare companies for database
      const companiesToStore = companies.map(company => ({
        company_name: company.company_name,
        legal_name: company.legal_name || company.company_name,
        tax_id: company.tax_id,
        website: company.website,
        email: company.email,
        phone: company.phone,
        address: company.address,
        city: company.city,
        description: company.description,
        country: company.country,
        source_platform: company.source_platform,
        source_url: company.source_url,
        data_quality_score: company.data_quality_score,
        industry: company.industry,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      // Insert companies in batches
      const batchSize = 100;
      let stored = 0;
      
      for (let i = 0; i < companiesToStore.length; i += batchSize) {
        const batch = companiesToStore.slice(i, i + batchSize);
        
        const { data, error } = await this.supabase
          .from('companies')
          .insert(batch)
          .select();

        if (error) {
          console.error('❌ Database error:', error.message);
          continue;
        }

        stored += batch.length;
        console.log(`  ✅ Stored batch ${Math.floor(i/batchSize) + 1}: ${batch.length} companies`);
      }

      console.log(`🎉 Successfully stored ${stored} companies to database!`);
      return stored;
      
    } catch (error) {
      console.error('❌ Failed to store companies:', error.message);
      return 0;
    }
  }

  async getCompanies(limit = 100) {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('*')
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Database error:', error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Failed to get companies:', error.message);
      return [];
    }
  }

  async getCompanyStats() {
    try {
      const { count, error } = await this.supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('❌ Database error:', error.message);
        return { total: 0 };
      }

      return { total: count || 0 };
    } catch (error) {
      console.error('❌ Failed to get stats:', error.message);
      return { total: 0 };
    }
  }
}

module.exports = new DatabaseService();
