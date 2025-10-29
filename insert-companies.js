const SupabaseService = require('./src/services/SupabaseService');
const { company: companiesData } = require('./companies');

async function insertCompaniesData() {
  try {
    console.log('Starting data insertion...');

    // Transform the data to match database schema
    const transformedCompanies = companiesData.map(company => ({
      company_name: company.name,
      website: company.website,
      email: company.email !== 'Not publicly listed' ? company.email : null,
      phone: company.phone !== 'Not publicly listed' ? company.phone : null,
      city: company.city,
      region: company.county,
      address: company.address,
      country: 'RO', // All companies appear to be Romanian
      linkedin_url: company.linkedin,
      description: company.specialties ? company.specialties.join(', ') : null,
      technologies: company.technologies,
      specialties: company.specialties,
      source_platform: 'manual_import',
      source_url: company.website,
      data_quality_score: calculateDataQuality(company),
      completeness_score: calculateCompleteness(company),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    console.log(`Transformed ${transformedCompanies.length} companies`);

    // Insert in batches to avoid timeout
    const batchSize = 50;
    let inserted = 0;

    for (let i = 0; i < transformedCompanies.length; i += batchSize) {
      const batch = transformedCompanies.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(transformedCompanies.length/batchSize)}`);

      try {
        await SupabaseService.upsertCompanies(batch);
        inserted += batch.length;
        console.log(`Inserted ${inserted}/${transformedCompanies.length} companies`);
      } catch (error) {
        console.error(`Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error.message);
        // Continue with next batch
      }
    }

    console.log('Data insertion completed successfully!');
    console.log(`Total companies inserted: ${inserted}`);

  } catch (error) {
    console.error('Error during data insertion:', error);
    throw error;
  }
}

function calculateDataQuality(company) {
  let score = 0;
  const fields = {
    name: 20,
    website: 15,
    email: company.email !== 'Not publicly listed' ? 15 : 0,
    city: 10,
    address: 10,
    technologies: 10,
    specialties: 10,
    linkedin: 10
  };

  Object.entries(fields).forEach(([field, points]) => {
    if (company[field] && company[field] !== 'Not publicly listed') {
      score += points;
    }
  });

  return Math.min(score, 100);
}

function calculateCompleteness(company) {
  let score = 0;
  const fields = ['name', 'website', 'email', 'city', 'address', 'technologies', 'specialties'];

  fields.forEach(field => {
    if (company[field] && company[field] !== 'Not publicly listed') {
      score += Math.round(100 / fields.length);
    }
  });

  return Math.min(score, 100);
}

// Run the insertion
if (require.main === module) {
  insertCompaniesData()
    .then(() => {
      console.log('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { insertCompaniesData };
