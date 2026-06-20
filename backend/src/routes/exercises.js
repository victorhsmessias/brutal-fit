const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { verifyToken } = require('../config/auth');
const ExerciseModel = require('../models/ExerciseModel');
const cache = require('../config/cache');
const logger = require('../config/logger');

const router = express.Router();

router.use(verifyToken);

router.get(
  '/',
  [
    query('search').optional().trim(),
    query('category').optional().trim(),
    query('muscle').optional().trim(),
    query('equipment').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { search = '', category = '', muscle = '', equipment = '' } = req.query;
    const cacheKey = `exercises:${search}:${category}:${muscle}:${equipment}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    try {
      const results = await ExerciseModel.search({ term: search, category, muscle, equipment });
      cache.set(cacheKey, results);
      logger.logSearch(req.user.id, { search, category, muscle, equipment });
      return res.status(200).json(results);
    } catch {
      return res.status(500).json({ error: 'Erro ao buscar exercícios.' });
    }
  }
);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório.').isLength({ max: 200 }).withMessage('Nome muito longo.'),
    body('description').optional().trim().isLength({ max: 5000 }).withMessage('Descrição muito longa.'),
    body('category').optional().trim().isLength({ max: 100 }),
    body('muscles').optional().isArray().withMessage('Músculos deve ser um array.'),
    body('muscles.*').optional().trim(),
    body('equipment').optional().isArray().withMessage('Equipamento deve ser um array.'),
    body('equipment.*').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category, muscles, equipment } = req.body;

    try {
      const exercise = await ExerciseModel.insert({
        name,
        description,
        category,
        muscles,
        equipment,
        created_by: req.user.id,
      });

      cache.flushAll();

      logger.logInsert(req.user.id, name);
      return res.status(201).json(exercise);
    } catch {
      return res.status(500).json({ error: 'Erro ao inserir exercício.' });
    }
  }
);

module.exports = router;
