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

const getChildData = async (id) => {
  return db('Child')
    .where({ id })
    .first()
    .select('id', 'name', 'username', 'current_mission', 'avatar_url');
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
    .first()
    .select('file_path');
  const mission = await db('Missions')
    .where({ id: current_mission })
    .returning('id', 'title', 'writing_prompt', 'drawing_prompt')
    .first();
  const missionObj = {
    mission_id: mission.id,
    read: reading.file_path,
    write: mission.writing_prompt,
    draw: mission.drawing_prompt,
  };
  return missionObj;
};

const addDrawing = async (drawingObj) => {
  return db('Drawing_Responses').insert(drawingObj).returning('*');
};

const addWriting = async (writingObj) => {
  return db('Writing_Responses').insert(writingObj).returning('*');
};

const getArchive = async (id) => {
  return db('Writing_Responses').where({ child_id: id }).select('*');
};

const getMissionProgress = async (id) => {
  return db('Mission_Progress').where({ child_id: id }).first().select('*');
};

const createMissionProgress = async (id) => {
  return db('Mission_Progress').insert({ child_id: id }).returning('*');
};

//moves a child to the next mission and resets their mission progress
const nextMission = async (child_id, mission_id) => {
  const updatedChildObject = await db('Child')
    .where({ id: child_id })
    .first()
    .update({ current_mission: mission_id + 1 })
    .returning('*');
  const updatedMissionProgress = await db('Mission_Progress')
    .where({ child_id })
    .first()
    .update({
      mission_id: mission_id,
      read: false,
      write: false,
      draw: false,
    });
  return {
    child: {
      id: updatedChildObject.id,
      name: updatedChildObject.name,
      username: updatedChildObject,
      current_mission: updatedChildObject.current_mission,
      avatar_url: updatedChildObject.avatar_url,
      mission_progress: {
        read: updatedMissionProgress.read,
        write: updatedMissionProgress.write,
        draw: updatedMissionProgress.draw,
      },
    },
  };
};

//toggle the read write or draw collumn to true in the mission progress table
const updateProgress = async (child_id, field) => {
  const change = {};
  change[field] = true;
  return db('Mission_Progress')
    .where({ child_id })
    .first()
    .update(change)
    .returning('read, write, draw');
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
  getArchive,
  getChildData,
  getMissionProgress,
  createMissionProgress,
  nextMission,
  updateProgress,
};
