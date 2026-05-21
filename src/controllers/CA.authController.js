const User = require('../models/AI.User');
const { generateToken, generateRefreshToken } = require('../config/CA.jwt.config');

const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password, phone_number, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nama, email, dan password harus diisi'
        });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email sudah terdaftar'
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        phone_number,
        role: role || 'donor'
      });

      const token = generateToken(user.user_id, user.role);

      res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        data: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email dan password harus diisi'
        });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email atau password salah'
        });
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email atau password salah'
        });
      }

      const token = generateToken(user.user_id, user.role);
      const refreshToken = generateRefreshToken(user.user_id);

      res.json({
        success: true,
        message: 'Login berhasil',
        data: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token,
        refreshToken
      });
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;

