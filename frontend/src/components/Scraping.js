import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Scraping = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    country: '',
    source: '',
    query: ''
  });

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/queue/jobs');
      setJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      await api.post('/scrape/start', newJobForm);
      setNewJobForm({ country: '', source: '', query: '' });
      await fetchJobs();
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Error creating scraping job');
    } finally {
      setCreating(false);
    }
  };

  const getJobStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'danger';
      case 'active':
        return 'primary';
      case 'waiting':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Scraping Jobs</h1>
            <button 
              className="btn btn-outline-primary"
              onClick={fetchJobs}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {/* Create New Job */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Create New Scraping Job</h5>
            </div>
            <div className="card-body">
              <form onSubmit={createJob}>
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">Country</label>
                    <select 
                      className="form-select"
                      value={newJobForm.country}
                      onChange={(e) => setNewJobForm({...newJobForm, country: e.target.value})}
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="italy">Italy</option>
                      <option value="romania">Romania</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Source</label>
                    <select 
                      className="form-select"
                      value={newJobForm.source}
                      onChange={(e) => setNewJobForm({...newJobForm, source: e.target.value})}
                      required
                    >
                      <option value="">Select Source</option>
                      <option value="kompass">Kompass</option>
                      <option value="paginegialle">Pagine Gialle</option>
                      <option value="anis">ANIS Romania</option>
                      <option value="listafirme">Lista Firme</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Search Query</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g., software development"
                      value={newJobForm.query}
                      onChange={(e) => setNewJobForm({...newJobForm, query: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={creating}
                  >
                    {creating ? 'Creating...' : 'Start Scraping'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Jobs List */}
          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div>
              {jobs.length === 0 ? (
                <div className="text-center py-5">
                  <h4>No scraping jobs found</h4>
                  <p className="text-muted">Create your first scraping job above</p>
                </div>
              ) : (
                <div className="row">
                  {jobs.map((job) => (
                    <div key={job.id} className="col-lg-6 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h6 className="card-title mb-0">{job.name}</h6>
                            <span className={`badge bg-${getJobStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          
                          <div className="mb-2">
                            <small className="text-muted">
                              <strong>Country:</strong> {job.data?.country || 'N/A'}
                            </small>
                          </div>
                          
                          <div className="mb-2">
                            <small className="text-muted">
                              <strong>Source:</strong> {job.data?.source || 'N/A'}
                            </small>
                          </div>
                          
                          {job.data?.query && (
                            <div className="mb-2">
                              <small className="text-muted">
                                <strong>Query:</strong> {job.data.query}
                              </small>
                            </div>
                          )}
                          
                          <div className="mb-2">
                            <small className="text-muted">
                              <strong>Created:</strong> {formatDate(job.timestamp)}
                            </small>
                          </div>
                          
                          {job.processedOn && (
                            <div className="mb-2">
                              <small className="text-muted">
                                <strong>Processed:</strong> {formatDate(job.processedOn)}
                              </small>
                            </div>
                          )}
                          
                          {job.returnvalue && (
                            <div className="mb-2">
                              <small className="text-success">
                                <strong>Result:</strong> {job.returnvalue.message}
                                {job.returnvalue.companiesFound && (
                                  <span> ({job.returnvalue.companiesFound} companies found)</span>
                                )}
                              </small>
                            </div>
                          )}
                          
                          {job.failedReason && (
                            <div className="mb-2">
                              <small className="text-danger">
                                <strong>Error:</strong> {job.failedReason}
                              </small>
                            </div>
                          )}
                          
                          {job.progress && (
                            <div className="mb-2">
                              <div className="progress" style={{ height: '5px' }}>
                                <div 
                                  className="progress-bar" 
                                  role="progressbar" 
                                  style={{ width: `${job.progress}%` }}
                                ></div>
                              </div>
                              <small className="text-muted">Progress: {job.progress}%</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scraping;
