import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Companies Scraper</h5>
            <p className="text-muted">
              Advanced web scraping platform for Italian and Romanian software companies.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-muted mb-0">
              © {new Date().getFullYear()} Companies Scraper. All rights reserved.
            </p>
            <small className="text-muted">
              Built with React, Node.js, and Supabase
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
