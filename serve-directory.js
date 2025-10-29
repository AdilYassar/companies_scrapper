const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve the companies directory page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'companies-directory.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Company Directory Server is running' });
});

app.listen(port, () => {
  console.log(`🚀 Company Directory Server running at http://localhost:${port}`);
  console.log(`📊 View companies at: http://localhost:${port}`);
  console.log(`💡 Make sure to update SUPABASE_URL and SUPABASE_ANON_KEY in companies-directory.html`);
});
