const db = require('../../data/db-config');

const findAll = async () => {
  return await db('Child');
};

const findBy = (filter) => {
  return db('Child').where(filter);
};

const findById = async (id) => {
  return db('Child').where({ id }).first().select('*');
};

const create = async (profile) => {
  return db('Child').insert(profile).returning('*');
};

const update = (id, changes) => {
  console.log(changes);
  return db('profiles')
    .where({ id: id })
    .first()
    .update(changes)
    .returning('*');
};

const remove = async (id) => {
  return await db('Child').where({ id }).del();
};

const findOrCreateChild = async (childObj) => {
  const foundChild = await findById(childObj.id).then((child) => child);
  if (foundChild) {
    return foundChild;
  } else {
    return await create(childObj).then((newChild) => {
      return newChild ? newChild[0] : newChild;
    });
  }
};

//I will make this return prettier data later
const getChildSubmissions = async (id) => {
  const drawingsArr = await db('Drawing_Responses')
    .where({ child_id: id })
    .returning('file_path', 'mission_id');
  const storiesArr = await db('Writing_Responses')
    .where({ child_id: id })
    .returning('file_path', 'mission_id');
  const archive = {
    drawings: drawingsArr,
    stories: storiesArr,
  };
  return archive;
};

const getCurrentMission = async (current_mission) => {
  const reading = await db('Story')
    .where({ mission_id: current_mission })
    .returning('file_path');
  const mission = await db('Missions')
    .where({ id: current_mission })
    .returning('id', 'title', 'writing_prompt', 'drawing_prompt')
    .first();
  const missionObj = {
    mission_id: mission.id,
    read: reading,
    write: mission.writing_prompt,
    draw: mission.drawing_prompt,
  };
  return missionObj;
};

const addDrawing = async (drawingObj) => {
  return db('Drawing_Responses').insert(drawingObj).returning('*');
};

const addWriting = async (writingObj) => {
  return db('Drawing_Responses').insert(writingObj).returning('*');
};

module.exports = {
  findAll,
  findBy,
  findById,
  create,
  update,
  remove,
  findOrCreateChild,
  getChildSubmissions,
  getCurrentMission,
  addDrawing,
  addWriting,
};
