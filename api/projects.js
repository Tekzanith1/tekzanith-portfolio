const portfolioData = require('../data/portfolio-data.json');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const { category, q, id } = req.query || {};
  let projects = [...portfolioData.projects];

  // Specific project by ID
  if (id) {
    const project = projects.find(p => p.id === id);
    if (!project) {
      return res.status(404).json({ error: `Project '${id}' not found.` });
    }
    return res.status(200).json(project);
  }

  // Filter by category
  if (category && category !== 'all') {
    projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by search query
  if (q) {
    const query = q.toLowerCase();
    projects = projects.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.summary.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );
  }

  res.status(200).json({
    total: projects.length,
    category: category || 'all',
    data: projects
  });
};
