const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

class SupabaseService {
  constructor() {
    this.supabase = createClient(config.supabase.url, config.supabase.serviceKey);
  }
  
  // Company CRUD operations
  async createCompany(companyData) {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }
  
  async getCompany(id) {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting company:', error);
      throw error;
    }
  }
  
  async updateCompany(id, updates) {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  }
  
  async deleteCompany(id) {
    try {
      const { error } = await this.supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }
  
  // Batch operations
  async createCompanies(companies) {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .insert(companies)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating companies:', error);
      throw error;
    }
  }
  
  async upsertCompanies(companies) {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .upsert(companies, { 
          onConflict: 'tax_id,country',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error upserting companies:', error);
      throw error;
    }
  }
  
  // Query operations
  async getCompanies(filters = {}) {
    try {
      let query = this.supabase
        .from('companies')
        .select('*');
      
      // Apply filters
      if (filters.country) {
        query = query.eq('country', filters.country);
      }
      
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      
      if (filters.industry) {
        query = query.eq('industry', filters.industry);
      }
      
      if (filters.min_employees) {
        query = query.gte('employee_count', filters.min_employees);
      }
      
      if (filters.max_employees) {
        query = query.lte('employee_count', filters.max_employees);
      }
      
      if (filters.has_website) {
        query = query.not('website', 'is', null);
      }
      
      if (filters.page && filters.limit) {
        const offset = (filters.page - 1) * filters.limit;
        query = query.range(offset, offset + filters.limit - 1);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting companies:', error);
      throw error;
    }
  }
  
  async getCompaniesByCountry(country) {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('*')
        .eq('country', country);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting companies by country:', error);
      throw error;
    }
  }
  
  async searchCompanies(searchTerm) {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('*')
        .textSearch('search_vector', searchTerm);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error searching companies:', error);
      throw error;
    }
  }
  
  // Statistics
  async getCompanyStats() {
    try {
      const { data, error } = await this.supabase
        .from('companies')
        .select('country, industry, company_size, created_at');
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        byCountry: {},
        byIndustry: {},
        bySize: {},
        recent: data.filter(c => {
          const created = new Date(c.created_at);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return created > weekAgo;
        }).length
      };
      
      data.forEach(company => {
        // By country
        stats.byCountry[company.country] = (stats.byCountry[company.country] || 0) + 1;
        
        // By industry
        if (company.industry) {
          stats.byIndustry[company.industry] = (stats.byIndustry[company.industry] || 0) + 1;
        }
        
        // By size
        if (company.company_size) {
          stats.bySize[company.company_size] = (stats.bySize[company.company_size] || 0) + 1;
        }
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting company stats:', error);
      throw error;
    }
  }
  
  // Job operations
  async createScrapingJob(jobData) {
    try {
      const { data, error } = await this.supabase
        .from('scraping_jobs')
        .insert([jobData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating scraping job:', error);
      throw error;
    }
  }
  
  async updateScrapingJob(id, updates) {
    try {
      const { data, error } = await this.supabase
        .from('scraping_jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating scraping job:', error);
      throw error;
    }
  }
  
  async getScrapingJob(id) {
    try {
      const { data, error } = await this.supabase
        .from('scraping_jobs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting scraping job:', error);
      throw error;
    }
  }
  
  async getScrapingJobs(filters = {}) {
    try {
      let query = this.supabase
        .from('scraping_jobs')
        .select('*');
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.country) {
        query = query.eq('country', filters.country);
      }
      
      if (filters.job_type) {
        query = query.eq('job_type', filters.job_type);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting scraping jobs:', error);
      throw error;
    }
  }
  
  // Logging
  async createScrapingLog(logData) {
    try {
      const { data, error } = await this.supabase
        .from('scraping_logs')
        .insert([logData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating scraping log:', error);
      throw error;
    }
  }
  
  async getScrapingLogs(jobId) {
    try {
      const { data, error } = await this.supabase
        .from('scraping_logs')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting scraping logs:', error);
      throw error;
    }
  }

  // Generate URL-friendly slug
  generateSlug(companyName, country) {
    if (!companyName) return null;
    const baseSlug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
    return `${baseSlug}-${country.toLowerCase()}`;
  }

  // Store multiple companies
  async storeCompanies(companies) {
    try {
      console.log(`💾 Storing ${companies.length} companies to database...`);
      
      // Prepare companies for database
      const companiesToStore = companies.map(company => {
        const slug = this.generateSlug(company.company_name, company.country);
        return {
          company_name: company.company_name,
          legal_name: company.legal_name || company.company_name,
          slug: slug,
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
        };
      });

      // Remove duplicates based on slug
      const uniqueCompanies = companiesToStore.filter((company, index, self) => 
        index === self.findIndex(c => c.slug === company.slug)
      );

      console.log(`📊 After deduplication: ${uniqueCompanies.length} unique companies`);

      // Insert companies in batches
      const batchSize = 100;
      let stored = 0;
      
      for (let i = 0; i < uniqueCompanies.length; i += batchSize) {
        const batch = uniqueCompanies.slice(i, i + batchSize);
        
        const { data, error } = await this.supabase
          .from('companies')
          .upsert(batch, { 
            onConflict: 'slug',
            ignoreDuplicates: false 
          })
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
}

module.exports = SupabaseService;
