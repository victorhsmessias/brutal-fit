const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const UserModel = require('../models/UserModel');
const { verifyToken, invalidateToken } = require('../config/auth');
const logger = require('../config/logger');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
});

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido.'),
    body('password').notEmpty().withMessage('Senha é obrigatória.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const ip = req.ip;

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        logger.logAuthError(email, ip);
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        logger.logAuthError(email, ip);
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      logger.logAuthSuccess(email, ip);
      return res.status(200).json({ token, user: { id: user.id, email: user.email } });
    } catch {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
);

router.post('/logout', verifyToken, (req, res) => {
  invalidateToken(req.token);
  logger.logLogout(req.user.id, req.ip);
  return res.status(200).json({ message: 'Logout realizado com sucesso.' });
});

module.exports = router;
