import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    country: '',
    search: '',
    page: 1,
    limit: 20
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCompanies();
  }, [filters]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/companies?${params.toString()}`);
      // API returns { success: true, companies: [], pagination: {} }
      if (response.data.success) {
        setCompanies(response.data.companies || []);
        const total = response.data.pagination?.total || response.data.companies?.length || 0;
        setTotalPages(Math.ceil(total / filters.limit));
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Companies Directory</h1>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary"
                onClick={fetchCompanies}
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="filter-section">
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Country</label>
                <select 
                  className="form-select"
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                >
                  <option value="">All Countries</option>
                  <option value="IT">Italy</option>
                  <option value="RO">Romania</option>
                </select>
              </div>
              <div className="col-md-8">
                <label className="form-label">Search</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="Search by company name, email, or website..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Companies List */}
          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div>
              {companies.length === 0 ? (
                <div className="text-center py-5">
                  <h4>No companies found</h4>
                  <p className="text-muted">Try adjusting your filters or start a new scraping job</p>
                </div>
              ) : (
                <div className="row">
                  {companies.map((company) => (
                    <div key={company.id} className="col-lg-6 mb-3">
                      <div className="card company-card">
                        <div className="card-body">
                          <div className="company-header">
                            <div className="company-name">{company.company_name || company.name}</div>
                            <span className="company-country">
                              {company.country?.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="company-details">
                            {company.description && (
                              <div className="detail-item">
                                <span className="detail-label">Description: </span>
                                <span>{company.description.substring(0, 100)}...</span>
                              </div>
                            )}
                            
                            {company.email && (
                              <div className="detail-item">
                                <span className="detail-label">Email: </span>
                                <a href={`mailto:${company.email}`}>{company.email}</a>
                              </div>
                            )}
                            
                            {company.website && (
                              <div className="detail-item">
                                <span className="detail-label">Website: </span>
                                <a href={company.website} target="_blank" rel="noopener noreferrer">
                                  {company.website}
                                </a>
                              </div>
                            )}
                            
                            {company.phone && (
                              <div className="detail-item">
                                <span className="detail-label">Phone: </span>
                                <span>{company.phone}</span>
                              </div>
                            )}
                            
                            {company.address && (
                              <div className="detail-item">
                                <span className="detail-label">Address: </span>
                                <span>{company.address}</span>
                              </div>
                            )}
                            
                            {company.industry && (
                              <div className="detail-item">
                                <span className="detail-label">Industry: </span>
                                <span>{company.industry}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${filters.page === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 1}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const pageNumber = Math.max(1, filters.page - 2) + index;
                      if (pageNumber <= totalPages) {
                        return (
                          <li key={pageNumber} className={`page-item ${filters.page === pageNumber ? 'active' : ''}`}>
                            <button 
                              className="page-link"
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          </li>
                        );
                      }
                      return null;
                    })}
                    
                    <li className={`page-item ${filters.page === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Companies;
