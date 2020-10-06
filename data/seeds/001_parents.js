const faker = require('faker');
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Parent')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('Parent').insert([
        {
          id: '00ulthapbErVUwVJy4x6',
          name: faker.name.firstName(),
          email: 'llama001@maildrop.cc',
          pin: '1234',
          subscription: true,
          admin: false,
        },
        //{name: faker.name.firstName(), email: 'llama002@maildrop.cc', pin: 1234, subscription: 1, admin: false},
      ]);
    });
};
