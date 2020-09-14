const faker = require('faker');
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Missions').del()
    .then(function () {
      // Inserts seed entries
      return knex('Missions').insert([
        {title: 'Mission 1', writing_prompt: 'writing prompt 1', drawing_prompt: 'drawing prompt 1' },
        {title: 'Mission 2', writing_prompt: 'writing prompt 2', drawing_prompt: 'drawing prompt 2' },
        {title: 'Mission 3', writing_prompt: 'writing prompt 3', drawing_prompt: 'drawing prompt 3' }
      ]);
    });
};
