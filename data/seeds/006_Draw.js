const faker = require('faker');
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Drawing_Responses').del()
    .then(function () {
      // Inserts seed entries
      return knex('Drawing_Responses').insert([
        {file_path: faker.image.imageUrl(), flagged: false, child_id: 1, mission_id: 1},
        {file_path: faker.image.imageUrl(), flagged: false, child_id: 1, mission_id: 2},
        {file_path: faker.image.imageUrl(), flagged: false, child_id: 1, mission_id: 3},
        {file_path: faker.image.imageUrl(), flagged: false, child_id: 2, mission_id: 1},
        {file_path: faker.image.imageUrl(), flagged: false, child_id: 2, mission_id: 2},
        {file_path: faker.image.imageUrl(), flagged: false, child_id: 2, mission_id: 3},
        {file_path: faker.image.imageUrl(), flagged: false, child_id: 3, mission_id: 1},
        {file_path: faker.image.imageUrl(), flagged: false, child_id: 3, mission_id: 2},
        {file_path: faker.image.imageUrl(), flagged: false, child_id: 3, mission_id: 3},
        {file_path: faker.image.imageUrl(), flagged: false, child_id: 4, mission_id: 1},
        {file_path: faker.image.imageUrl(), flagged: false, child_id: 4, mission_id: 2},
        {file_path: faker.image.imageUrl(), flagged: false, child_id: 4, mission_id: 3},
 

      ]);
    });
};