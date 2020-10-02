//const faker = require('faker');
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Missions')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('Missions').insert([
        {
          title: 'Mission 1',
          writing_prompt:
            'Imagine and write down a scene from Finn’s Little League tryouts. (In case you’re wondering, flipperball is a lot like soccer, and your job is to imagine how Finn performed as the coaches looked on.) Write your story with a pencil and no more than 5 sheets of loose-leaf paper, then take a photo and upload it to Story Squad. 1',
          drawing_prompt:
            'Draw one scene from Chapters 1-2. For a caption to your picture, write out the sentence from the main story where your picture should appear. Use whatever coloring supplies you want on a loose-leaf sheet of paper, then take a photo and upload it to Story Squad.',
        },
        {
          title: 'Mission 2',
          writing_prompt: 'writing prompt 2',
          drawing_prompt: 'drawing prompt 2',
        },
        {
          title: 'Mission 3',
          writing_prompt: 'writing prompt 3',
          drawing_prompt: 'drawing prompt 3',
        },
      ]);
    });
};
