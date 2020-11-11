exports.up = function (knex) {
  return knex.schema.table('Drawing_Responses', function (tbl) {
    tbl.integer('score').notNullable().defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.table('Drawing_Responses', function (tbl) {
    tbl.dropColumn('score');
  });
};
