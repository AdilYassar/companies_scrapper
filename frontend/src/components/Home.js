import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    italianCompanies: 0,
    romanianCompanies: 0,
    activeJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Try to fetch stats, if it fails, fetch companies and calculate stats
      try {
        const response = await api.get('/companies/stats');
        const statsData = response.data.stats || response.data.data || response.data;
        setStats({
          totalCompanies: statsData.total || statsData.totalCompanies || 0,
          italianCompanies: statsData.byCountry?.IT || statsData.italianCompanies || 0,
          romanianCompanies: statsData.byCountry?.RO || statsData.romanianCompanies || 0,
          activeJobs: statsData.activeJobs || 0
        });
      } catch (statsError) {
        // Fallback: fetch companies and calculate stats
        const companiesResponse = await api.get('/companies?limit=1000');
        const companies = companiesResponse.data.companies || companiesResponse.data.data?.companies || [];
        const italianCount = companies.filter(c => c.country === 'IT' || c.country === 'italy').length;
        const romanianCount = companies.filter(c => c.country === 'RO' || c.country === 'romania').length;
        setStats({
          totalCompanies: companies.length,
          italianCompanies: italianCount,
          romanianCompanies: romanianCount,
          activeJobs: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set defaults on error
      setStats({
        totalCompanies: 0,
        italianCompanies: 0,
        romanianCompanies: 0,
        activeJobs: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="hero-title">Companies Scraper</h1>
              <p className="hero-subtitle">
                Advanced web scraping platform for Italian and Romanian software companies
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/companies" className="btn btn-light btn-lg">
                  View Companies
                </Link>
                <Link to="/scraping" className="btn btn-outline-light btn-lg">
                  Start Scraping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-6 text-center mb-4">
              <div className="stat-number">{stats.totalCompanies}</div>
              <div className="stat-label">Total Companies</div>
            </div>
            <div className="col-md-3 col-6 text-center mb-4">
              <div className="stat-number">{stats.italianCompanies}</div>
              <div className="stat-label">Italian Companies</div>
            </div>
            <div className="col-md-3 col-6 text-center mb-4">
              <div className="stat-number">{stats.romanianCompanies}</div>
              <div className="stat-label">Romanian Companies</div>
            </div>
            <div className="col-md-3 col-6 text-center mb-4">
              <div className="stat-number">{stats.activeJobs}</div>
              <div className="stat-label">Active Jobs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col">
              <h2>Platform Features</h2>
              <p className="text-muted">Powerful tools for comprehensive company data collection</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 text-center mb-4">
              <div className="feature-icon">🌐</div>
              <h4>Multi-Source Scraping</h4>
              <p className="text-muted">
                Collect data from 10+ sources per country including business registries and platforms
              </p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <div className="feature-icon">🤖</div>
              <h4>Automated Processing</h4>
              <p className="text-muted">
                Background job processing with real-time progress tracking and monitoring
              </p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <div className="feature-icon">📊</div>
              <h4>Smart Deduplication</h4>
              <p className="text-muted">
                Intelligent duplicate detection and data merging for clean datasets
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
