/**
 * DEBUG API - Para diagnosticar problemas
 */

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Parse body se for POST
    let body = null;
    if (req.method === 'POST') {
      body = req.body || 'Body não disponível';
    }

    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: body
      },
      environment: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeVersion: process.version,
        platform: process.platform
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
};

