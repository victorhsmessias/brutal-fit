const knex = require('knex');
const path = require('path');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, '../../database.sqlite'),
  },
  useNullAsDefault: true,
  pool: {
    min: 1,
    max: 5,
  },
});

async function initializeDatabase() {
  const hasUsers = await db.schema.hasTable('users');
  if (!hasUsers) {
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }

  const hasExercises = await db.schema.hasTable('exercises');
  if (!hasExercises) {
    await db.schema.createTable('exercises', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.string('category');
      table.text('muscles');
      table.text('equipment');
      table.integer('created_by').references('id').inTable('users');
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
  }
}

module.exports = { db, initializeDatabase };
