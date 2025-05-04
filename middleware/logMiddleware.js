import Log from '../models/Log.js';

export const logAction = async (req, res, next) => {
  try {
    const log = new Log({
      action: `${req.method} ${req.originalUrl}`,
      user: req.body?.userId || 'anonymous',
      timestamp: new Date(),
      details: {
        params: req.params,
        query: req.query,
        body: req.body,
        ip: req.ip,
      },
    });

    await log.save();
  } catch (err) {
    console.error('Log kaydedilirken hata:', err.message);
  }

  next();
};