/**
 * API Principal - Vercel Serverless
 * Handler temporário simplificado para debugging
 */

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Resposta temporária
  return res.status(200).json({
    status: 'ok',
    message: 'API Serverless funcionando! (modo simplificado)',
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
};

