const faker = require('faker');
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Story')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('Story').insert([
        { file_path: faker.image.imageUrl(), mission_id: 1 },
        { file_path: faker.image.imageUrl(), mission_id: 1 },
        { file_path: faker.image.imageUrl(), mission_id: 1 },
        { file_path: faker.image.imageUrl(), mission_id: 1 },
        { file_path: faker.image.imageUrl(), mission_id: 1 },
        { file_path: faker.image.imageUrl(), mission_id: 1 },
        { file_path: faker.image.imageUrl(), mission_id: 2 },
        { file_path: faker.image.imageUrl(), mission_id: 2 },
        { file_path: faker.image.imageUrl(), mission_id: 2 },
        { file_path: faker.image.imageUrl(), mission_id: 2 },
        { file_path: faker.image.imageUrl(), mission_id: 2 },
        { file_path: faker.image.imageUrl(), mission_id: 3 },
        { file_path: faker.image.imageUrl(), mission_id: 3 },
        { file_path: faker.image.imageUrl(), mission_id: 3 },
        { file_path: faker.image.imageUrl(), mission_id: 3 },
      ]);
    });
};
