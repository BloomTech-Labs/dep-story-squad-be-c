const faker = require('faker');
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Writing_Responses')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('Writing_Responses').insert([
        {
          file_path: faker.image.imageUrl(),
          score: 90,
          flagged: false,
          child_id: 1,
          mission_id: 1,
        },
        {
          file_path: faker.image.imageUrl(),
          score: 47,
          flagged: false,
          child_id: 1,
          mission_id: 1,
        },
        {
          file_path: faker.image.imageUrl(),
          score: 74,
          flagged: false,
          child_id: 1,
          mission_id: 1,
        },
        {
          file_path: faker.image.imageUrl(),
          score: 90,
          flagged: false,
          child_id: 1,
          mission_id: 2,
        },
        {
          file_path: faker.image.imageUrl(),
          score: 90,
          flagged: false,
          child_id: 1,
          mission_id: 2,
        },
        {
          file_path: faker.image.imageUrl(),
          score: 47,
          flagged: false,
          child_id: 1,
          mission_id: 3,
        },
        {
          file_path: faker.image.imageUrl(),
          score: 74,
          flagged: false,
          child_id: 1,
          mission_id: 3,
        },
        {
          file_path: faker.image.imageUrl(),
          score: 90,
          flagged: false,
          child_id: 1,
          mission_id: 3,
        },
        {
          file_path: faker.image.imageUrl(),
          score: 90,
          flagged: false,
          child_id: 1,
          mission_id: 3,
        },
        /*{file_path: faker.image.imageUrl(), score: 47, flagged: false, child_id: 2, mission_id: 1},
        {file_path: faker.image.imageUrl(), score: 74, flagged: false, child_id: 2, mission_id: 1},
        {file_path: faker.image.imageUrl(), score: 90, flagged: false, child_id: 2, mission_id: 2},
        {file_path: faker.image.imageUrl(), score: 90, flagged: false, child_id: 2, mission_id: 2},
        {file_path: faker.image.imageUrl(), score: 47, flagged: false, child_id: 2, mission_id: 2},
        {file_path: faker.image.imageUrl(), score: 74, flagged: false, child_id: 2, mission_id: 3},
        {file_path: faker.image.imageUrl(), score: 90, flagged: false, child_id: 2, mission_id: 3},
        {file_path: faker.image.imageUrl(), score: 90, flagged: false, child_id: 3, mission_id: 1},
        {file_path: faker.image.imageUrl(), score: 47, flagged: false, child_id: 3, mission_id: 1},
        {file_path: faker.image.imageUrl(), score: 74, flagged: false, child_id: 3, mission_id: 2},
        {file_path: faker.image.imageUrl(), score: 90, flagged: false, child_id: 3, mission_id: 2},
        {file_path: faker.image.imageUrl(), score: 90, flagged: false, child_id: 3, mission_id: 2},
        {file_path: faker.image.imageUrl(), score: 47, flagged: false, child_id: 3, mission_id: 2},
        {file_path: faker.image.imageUrl(), score: 74, flagged: false, child_id: 3, mission_id: 3},
        {file_path: faker.image.imageUrl(), score: 90, flagged: false, child_id: 3, mission_id: 3},
        {file_path: faker.image.imageUrl(), score: 90, flagged: false, child_id: 4, mission_id: 1},
        {file_path: faker.image.imageUrl(), score: 47, flagged: false, child_id: 4, mission_id: 2},
        {file_path: faker.image.imageUrl(), score: 74, flagged: false, child_id: 4, mission_id: 2},
        {file_path: faker.image.imageUrl(), score: 90, flagged: false, child_id: 4, mission_id: 2},
        {file_path: faker.image.imageUrl(), score: 90, flagged: false, child_id: 4, mission_id: 2},
        {file_path: faker.image.imageUrl(), score: 47, flagged: false, child_id: 4, mission_id: 3},
        {file_path: faker.image.imageUrl(), score: 74, flagged: false, child_id: 4, mission_id: 3},
        {file_path: faker.image.imageUrl(), score: 90, flagged: false, child_id: 4, mission_id: 3},*/
      ]);
    });
};
