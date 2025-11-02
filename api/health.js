/**
 * Health Check - Vercel Serverless
 */

module.exports = async (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API Serverless está funcionando!'
  });
};

