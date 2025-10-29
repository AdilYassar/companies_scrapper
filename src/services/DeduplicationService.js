const stringSimilarity = require('string-similarity');
const natural = require('natural');

class DeduplicationService {
  constructor() {
    this.similarityThreshold = 0.8;
    this.nameWeight = 0.4;
    this.taxIdWeight = 0.3;
    this.websiteWeight = 0.2;
    this.addressWeight = 0.1;
  }
  
  // Find potential duplicates
  async findDuplicates(companies) {
    const duplicates = [];
    const processed = new Set();
    
    for (let i = 0; i < companies.length; i++) {
      if (processed.has(i)) continue;
      
      const company1 = companies[i];
      const similarCompanies = [];
      
      for (let j = i + 1; j < companies.length; j++) {
        if (processed.has(j)) continue;
        
        const company2 = companies[j];
        const similarity = this.calculateSimilarity(company1, company2);
        
        if (similarity >= this.similarityThreshold) {
          similarCompanies.push({
            company: company2,
            index: j,
            similarity
          });
          processed.add(j);
        }
      }
      
      if (similarCompanies.length > 0) {
        duplicates.push({
          primary: company1,
          primaryIndex: i,
          duplicates: similarCompanies,
          maxSimilarity: Math.max(...similarCompanies.map(d => d.similarity))
        });
        processed.add(i);
      }
    }
    
    return duplicates;
  }
  
  // Calculate similarity between two companies
  calculateSimilarity(company1, company2) {
    let totalScore = 0;
    let totalWeight = 0;
    
    // Tax ID exact match (highest priority)
    if (company1.tax_id && company2.tax_id) {
      if (company1.tax_id === company2.tax_id) {
        return 1.0; // Exact match
      }
    }
    
    // Company name similarity
    if (company1.company_name && company2.company_name) {
      const nameSimilarity = this.calculateNameSimilarity(
        company1.company_name, 
        company2.company_name
      );
      totalScore += nameSimilarity * this.nameWeight;
      totalWeight += this.nameWeight;
    }
    
    // Website similarity
    if (company1.website && company2.website) {
      const websiteSimilarity = this.calculateWebsiteSimilarity(
        company1.website, 
        company2.website
      );
      totalScore += websiteSimilarity * this.websiteWeight;
      totalWeight += this.websiteWeight;
    }
    
    // Address similarity
    if (company1.address && company2.address) {
      const addressSimilarity = this.calculateAddressSimilarity(
        company1.address, 
        company2.address
      );
      totalScore += addressSimilarity * this.addressWeight;
      totalWeight += this.addressWeight;
    }
    
    // Tax ID similarity (if not exact match)
    if (company1.tax_id && company2.tax_id && company1.tax_id !== company2.tax_id) {
      const taxIdSimilarity = this.calculateTaxIdSimilarity(
        company1.tax_id, 
        company2.tax_id
      );
      totalScore += taxIdSimilarity * this.taxIdWeight;
      totalWeight += this.taxIdWeight;
    }
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }
  
  // Calculate name similarity using multiple methods
  calculateNameSimilarity(name1, name2) {
    if (!name1 || !name2) return 0;
    
    // Normalize names
    const normalized1 = this.normalizeCompanyName(name1);
    const normalized2 = this.normalizeCompanyName(name2);
    
    // Exact match after normalization
    if (normalized1 === normalized2) return 1.0;
    
    // String similarity
    const stringSim = stringSimilarity.compareTwoStrings(normalized1, normalized2);
    
    // Jaccard similarity on words
    const words1 = new Set(normalized1.split(/\s+/));
    const words2 = new Set(normalized2.split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    const jaccardSim = intersection.size / union.size;
    
    // Levenshtein distance
    const levenshteinSim = 1 - (natural.LevenshteinDistance(normalized1, normalized2) / Math.max(normalized1.length, normalized2.length));
    
    // Weighted average
    return (stringSim * 0.4 + jaccardSim * 0.3 + levenshteinSim * 0.3);
  }
  
  // Normalize company name for comparison
  normalizeCompanyName(name) {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\b(srl|spa|sa|pfa|snc|sas)\b/g, '') // Remove legal forms
      .replace(/\b(inc|ltd|llc|corp|corporation)\b/g, '') // Remove common suffixes
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }
  
  // Calculate website similarity
  calculateWebsiteSimilarity(website1, website2) {
    if (!website1 || !website2) return 0;
    
    try {
      const domain1 = this.extractDomain(website1);
      const domain2 = this.extractDomain(website2);
      
      if (domain1 === domain2) return 1.0;
      
      return stringSimilarity.compareTwoStrings(domain1, domain2);
    } catch (error) {
      return 0;
    }
  }
  
  // Extract domain from URL
  extractDomain(url) {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.replace(/^www\./, '');
    } catch (error) {
      return url;
    }
  }
  
  // Calculate address similarity
  calculateAddressSimilarity(address1, address2) {
    if (!address1 || !address2) return 0;
    
    const normalized1 = this.normalizeAddress(address1);
    const normalized2 = this.normalizeAddress(address2);
    
    return stringSimilarity.compareTwoStrings(normalized1, normalized2);
  }
  
  // Normalize address for comparison
  normalizeAddress(address) {
    return address
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }
  
  // Calculate tax ID similarity
  calculateTaxIdSimilarity(taxId1, taxId2) {
    if (!taxId1 || !taxId2) return 0;
    
    // Clean tax IDs
    const clean1 = taxId1.replace(/\D/g, '');
    const clean2 = taxId2.replace(/\D/g, '');
    
    if (clean1 === clean2) return 1.0;
    
    // Check if one is a subset of the other
    if (clean1.includes(clean2) || clean2.includes(clean1)) {
      return 0.8;
    }
    
    return 0;
  }
  
  // Merge duplicate companies
  async mergeDuplicates(primary, duplicates) {
    const merged = { ...primary };
    
    // Merge data from duplicates, keeping the most complete information
    duplicates.forEach(duplicate => {
      const company = duplicate.company;
      
      // Merge fields, keeping non-null values
      Object.keys(company).forEach(key => {
        if (company[key] && !merged[key]) {
          merged[key] = company[key];
        }
      });
      
      // Merge arrays
      if (company.services && Array.isArray(company.services)) {
        merged.services = [...new Set([...(merged.services || []), ...company.services])];
      }
      
      if (company.technologies && Array.isArray(company.technologies)) {
        merged.technologies = [...new Set([...(merged.technologies || []), ...company.technologies])];
      }
      
      // Update data quality score
      merged.data_quality_score = this.calculateDataQualityScore(merged);
    });
    
    // Update source information
    merged.source_platform = 'merged';
    merged.source_url = 'multiple_sources';
    
    return merged;
  }
  
  // Calculate data quality score
  calculateDataQualityScore(company) {
    let score = 0;
    const fields = {
      company_name: 20,
      tax_id: 15,
      website: 15,
      email: 15,
      phone: 10,
      address: 10,
      city: 10,
      description: 5
    };
    
    Object.entries(fields).forEach(([field, points]) => {
      if (company[field] && company[field].toString().trim()) {
        score += points;
      }
    });
    
    return Math.min(score, 100);
  }
  
  // Process companies for deduplication
  async processCompanies(companies) {
    const duplicates = await this.findDuplicates(companies);
    const processed = new Set();
    const mergedCompanies = [];
    
    for (const duplicate of duplicates) {
      if (processed.has(duplicate.primaryIndex)) continue;
      
      // Merge duplicates
      const merged = await this.mergeDuplicates(
        duplicate.primary, 
        duplicate.duplicates.map(d => d.company)
      );
      
      mergedCompanies.push(merged);
      
      // Mark as processed
      processed.add(duplicate.primaryIndex);
      duplicate.duplicates.forEach(d => processed.add(d.index));
    }
    
    // Add non-duplicate companies
    companies.forEach((company, index) => {
      if (!processed.has(index)) {
        mergedCompanies.push(company);
      }
    });
    
    return {
      original: companies.length,
      duplicates: duplicates.length,
      merged: mergedCompanies.length,
      companies: mergedCompanies
    };
  }
}

module.exports = new DeduplicationService();
