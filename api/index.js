const portfolioData = require('../data/portfolio-data.json');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({
    status: 'online',
    version: '1.0.0',
    documentation: 'Tek Zanith Portfolio REST API',
    endpoints: {
      '/api/health': 'GET - Service health & timestamp',
      '/api/projects': 'GET - All projects (supports ?category= and ?q=)',
      '/api/projects/:id': 'GET - Specific project by ID',
      '/api/experience': 'GET - Career timeline & positions',
      '/api/skills': 'GET - Technical competencies & taxonomy',
      '/api/stats': 'GET - Key engineering metrics',
      '/api/contact': 'POST - Submit contact/inquiry message (JSON body: name, email, message)'
    },
    meta: {
      author: portfolioData.profile.name,
      title: portfolioData.profile.title,
      location: portfolioData.profile.location
    }
  });
};
