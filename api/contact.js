// In-memory messages store for serverless environment
const messages = [];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Read messages (for admin/monitoring)
  if (req.method === 'GET') {
    return res.status(200).json({
      totalMessages: messages.length,
      messages: messages.slice(-10)
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { name, email, subject, message } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid name (at least 2 characters).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ error: 'Message must be at least 5 characters long.' });
    }

    const newEntry = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || 'General Inquiry').trim(),
      message: message.trim(),
      receivedAt: new Date().toISOString()
    };

    messages.push(newEntry);

    return res.status(201).json({
      success: true,
      message: `Thank you, ${newEntry.name}! Your message has been received.`,
      referenceId: newEntry.id
    });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON payload.' });
  }
};
