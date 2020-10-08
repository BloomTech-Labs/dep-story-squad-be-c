const faker = require('faker');
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Child')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('Child').insert([
        {
          name: faker.name.firstName(),
          writing_score: 50,
          avatar_url:
            'https://www.uokpl.rs/fpng/d/12-129858_kid-superhero-clipart.png',
          pin: '1234',
          grade: 5,
          username: faker.internet.userName(),
          parent_id: '00ulthapbErVUwVJy4x6',
        },
        {
          name: faker.name.firstName(),
          writing_score: 50,
          avatar_url:
            'https://www.uokpl.rs/fpng/d/12-129858_kid-superhero-clipart.png',
          pin: '1234',
          grade: 4,
          username: faker.internet.userName(),
          parent_id: '00ulthapbErVUwVJy4x6',
        },
      ]);
    });
};
