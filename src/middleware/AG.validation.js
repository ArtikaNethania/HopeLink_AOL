// Validation middleware for HopeLink API

/**
 * Validate required fields in req.body
 * Usage: validateFields(['name', 'email', 'password'])
 */
const validateFields = (fields) => {
  return (req, res, next) => {
    const missing = fields.filter(field => {
      const val = req.body[field];
      return val === undefined || val === null || String(val).trim() === '';
    });

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`
      });
    }
    next();
  };
};

/**
 * Validate email format
 */
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
  }
  next();
};

/**
 * Validate password length (min 8 chars)
 */
const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (password && password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }
  next();
};

/**
 * Validate donation amount (must be positive number)
 */
const validateDonationAmount = (req, res, next) => {
  const { amount } = req.body;
  if (amount !== undefined) {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Donation amount must be a positive number'
      });
    }
  }
  next();
};

/**
 * Sanitize string fields — trim whitespace
 */
const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
};

module.exports = {
  validateFields,
  validateEmail,
  validatePassword,
  validateDonationAmount,
  sanitizeBody
};