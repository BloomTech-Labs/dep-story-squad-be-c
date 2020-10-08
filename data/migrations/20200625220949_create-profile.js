exports.up = (knex) => {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('Parent', function (table) {
      table.string('id').primary().unique().notNullable();
      table.string('name').notNullable().unique();
      table.string('email').notNullable().unique();
      table.string('pin').notNullable();
      table.boolean('admin').notNullable().defaultTo(0);
      table.boolean('subscription').notNullable().defaultTo(0);
      table.string('type').notNullable().defaultTo('parent');
      table.timestamps(true, true);
    })
    .createTable('Missions', function (table) {
      table.increments('id');
      table.string('title').notNullable();
      table.string('writing_prompt', 1000).notNullable();
      table.string('drawing_prompt', 1000).notNullable();
    })
    .createTable('Child', function (table) {
      table.increments('id');
      table.string('name');
      table.integer('writing_score').notNullable().defaultTo(50);
      table.string('avatar_url');
      table.string('pin').notNullable();
      table.string('type').notNullable().defaultTo('child');
      table.string('username').unique().notNullable();
      table.boolean('dyslexic').notNullable().defaultTo(0);
      table.integer('grade').notNullable();
      table
        .string('parent_id')
        .notNullable()
        .unsigned()
        .references('Parent.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('current_mission')
        .notNullable()
        .defaultTo(1)
        .unsigned()
        .references('Missions.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('Story', function (table) {
      table.increments('id');
      table.string('file_path').notNullable();
      table
        .integer('mission_id')
        .notNullable()
        .unsigned()
        .references('Missions.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('Mission_Progress', function (table) {
      table.increments('id');
      table
        .integer('child_id')
        .notNullable()
        .unsigned()
        .references('Child.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('mission_id')
        .notNullable()
        .unsigned()
        .defaultTo(1)
        .references('Missions.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.boolean('read').notNullable().defaultTo(0);
      table.boolean('write').notNullable().defaultTo(0);
      table.boolean('draw').notNullable().defaultTo(0);
    })
    .createTable('Writing_Responses', function (table) {
      table.increments('id');
      table.string('file_path').notNullable();
      table.integer('score').notNullable();
      table.boolean('flagged').notNullable().defaultTo(0);
      table
        .integer('child_id')
        .notNullable()
        .unsigned()
        .references('Child.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('mission_id')
        .notNullable()
        .unsigned()
        .references('Missions.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
    .createTable('Drawing_Responses', function (table) {
      table.increments('id');
      table.string('file_path').notNullable();
      table.boolean('flagged').notNullable().defaultTo(0);
      table
        .integer('child_id')
        .notNullable()
        .unsigned()
        .references('Child.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('mission_id')
        .notNullable()
        .unsigned()
        .references('Missions.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });
};

exports.down = (knex) => {
  return knex.schema
    .dropTableIfExists('Drawing_Responses')
    .dropTableIfExists('Writing_Responses')
    .dropTableIfExists('Mission_Progress')
    .dropTableIfExists('Child')
    .dropTableIfExists('Story')
    .dropTableIfExists('Missions')
    .dropTableIfExists('Parent');
};
