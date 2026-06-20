const { db } = require('../config/database');

function parse(ex) {
  return {
    ...ex,
    muscles: JSON.parse(ex.muscles || '[]'),
    equipment: JSON.parse(ex.equipment || '[]'),
  };
}

class ExerciseModel {
  static async search({ term = '', category = '', muscle = '', equipment = '' }) {
    let query = db('exercises');

    if (term) {
      query = query.where('name', 'like', `%${term}%`);
    }
    if (category) {
      query = query.where('category', category);
    }

    const rows = await query.orderBy('created_at', 'desc');
    const results = rows.map(parse);

    return results.filter((ex) => {
      if (muscle && !ex.muscles.includes(muscle)) return false;
      if (equipment && !ex.equipment.includes(equipment)) return false;
      return true;
    });
  }

  static async insert({ name, description, category, muscles, equipment, created_by }) {
    const [id] = await db('exercises').insert({
      name,
      description: description || null,
      category: category || null,
      muscles: JSON.stringify(muscles || []),
      equipment: JSON.stringify(equipment || []),
      created_by,
    });
    const row = await db('exercises').where({ id }).first();
    return parse(row);
  }
}

module.exports = ExerciseModel;
