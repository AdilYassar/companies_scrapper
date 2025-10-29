const SupabaseService = require('../services/SupabaseService');

class CompanyController {
  constructor() {
    this.supabaseService = new SupabaseService();
  }
  // Get all companies with filters
  async getCompanies(req, res) {
    try {
      const {
        country,
        city,
        industry,
        min_employees,
        max_employees,
        has_website,
        page = 1,
        limit = 20,
        search
      } = req.query;
      
      let filters = {};
      
      if (country) filters.country = country;
      if (city) filters.city = city;
      if (industry) filters.industry = industry;
      if (min_employees) filters.min_employees = parseInt(min_employees);
      if (max_employees) filters.max_employees = parseInt(max_employees);
      if (has_website) filters.has_website = has_website === 'true';
      if (page) filters.page = parseInt(page);
      if (limit) filters.limit = parseInt(limit);
      
      let companies;
      
      if (search) {
        companies = await this.supabaseService.searchCompanies(search);
      } else {
        companies = await this.supabaseService.getCompanies(filters);
      }
      
      res.json({
        success: true,
        companies: companies,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: companies.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Get single company
  async getCompany(req, res) {
    try {
      const { id } = req.params;
      
      const company = await this.supabaseService.getCompany(id);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          error: 'Company not found'
        });
      }
      
      res.json({
        success: true,
        company: company
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Update company
  async updateCompany(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const company = await this.supabaseService.updateCompany(id, updates);
      
      res.json({
        success: true,
        company: company
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Delete company
  async deleteCompany(req, res) {
    try {
      const { id } = req.params;
      
      await this.supabaseService.deleteCompany(id);
      
      res.json({
        success: true,
        message: 'Company deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Get company statistics
  async getCompanyStats(req, res) {
    try {
      const stats = await this.supabaseService.getCompanyStats();
      
      res.json({
        success: true,
        stats: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Export companies to CSV
  async exportCompanies(req, res) {
    try {
      const { country, format = 'csv' } = req.query;
      
      let companies;
      if (country) {
        companies = await this.supabaseService.getCompaniesByCountry(country);
      } else {
        companies = await this.supabaseService.getCompanies({ limit: 10000 });
      }
      
      if (format === 'csv') {
        const csv = this.convertToCSV(companies);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="companies_${country || 'all'}.csv"`);
        res.send(csv);
      } else {
        res.json({
          success: true,
          companies: companies
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // Convert companies to CSV
  convertToCSV(companies) {
    if (companies.length === 0) return '';
    
    const headers = Object.keys(companies[0]);
    const csvRows = [headers.join(',')];
    
    companies.forEach(company => {
      const values = headers.map(header => {
        const value = company[header];
        if (value === null || value === undefined) return '';
        if (Array.isArray(value)) return `"${value.join(';')}"`;
        if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
        return value;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }
}

module.exports = CompanyController;
