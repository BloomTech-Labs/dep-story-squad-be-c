var cron = require('node-cron');
const db = require('../../data/db-config');
/**
 * A method to get all children from the database
 * @returns {Promise} promise that resolves to array of all children
 */
const findAll = async () => {
  return await db('Child');
};

/**
 * A method to get a child by id
 * @param {int} id the unique id of the child within the DB
 * @returns {Promise} promise that resolves to a user with the matching id, empty if not found
 */
const findById = async (id) => {
  return db('Child').where({ id }).first().select('*');
};

/**
 * A method to delete the child with given id from the DB
 * @param {int} id
 * @returns {Promise} promise that resolves to a count of # rows deleted
 */
const remove = async (id) => {
  return await db('Child').where({ id }).del();
};

//I will make this return prettier data later
/**
 * A method to get the submissions a child has uploaded
 * @param {int} id
 * @returns {Promise} promise that resolves to an object with 2 arrays
 */
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

/**
 * A method to get the current mission prompt a child is on
 * @param {int} current_mission
 * @returns {Promise} promise that resolves to an object with mission info
 */
const getCurrentMission = async (current_mission) => {
  try {
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
  } catch (error) {
    // console.log('error', error);
  }
};

/**
 * A method to add a drawing object to the db
 * @param {Object} drawingObj
 * @returns {Promise} promise that resolves to an object with drawing info
 */
const addDrawing = async (drawingObj) => {
  return db('Drawing_Responses').insert(drawingObj).returning('*');
};

/**
 * A method to add a writing object to the db
 * @param {Object} writingObj
 *  @returns {Promise} promise that resolves to an object with writing info
 */
const addWriting = async (writingObj) => {
  return db('Writing_Responses').insert(writingObj).returning('*');
};

/**
 * A method to get the archive of writing/drawing submissions
 * @param {int} id
 * @returns {Promise} promise that resolves to an archive object
 */
const getArchive = async (id) => {
  return db('Writing_Responses').where({ child_id: id }).select('*');
};

/**
 * A method to get the mission progress object of a child
 * @param {int} id
 * @returns {Promise} promise that resolves to a mission progress object
 */
const getMissionProgress = async (id) => {
  return db('Mission_Progress').where({ child_id: id }).first().select('*');
};

/**
 * A method to create a mission progress object for the child specified
 * @param {int} id
 * @returns {Promise} promise that resovles to a mission progress object
 */
const createMissionProgress = async (id) => {
  try {
    return db('Mission_Progress')
      .insert({ child_id: id, read: false, write: false, draw: false })
      .returning('*');
  } catch (error) {
    // console.log('error', error);
  }
};

// TODO implement this with a cron-job to allow weekly resets (search node-cron)
/**
 * A method that moves a child to their next mission and resets their mission progress
 * @param {int} child_id child id number
 * @param {int} mission_id the int mission id the child is currently on
 * @returns {Promise} promise that resolves to a child object with mission progress
 */
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
        id: updatedMissionProgress.id,
        read: updatedMissionProgress.read,
        write: updatedMissionProgress.write,
        draw: updatedMissionProgress.draw,
      },
    },
  };
};

// Scheduling the reset of weekly misison using node-cron
const missionUpdate = cron.schedule(
  '* * * 1-12 6',
  () => {
    console.log('Mission has been reset!');
    nextMission();
  },
  {
    schedule: true,
    timezone: 'America/Denver',
  }
);

missionUpdate.start();

/**
 * A method to set the read, write, or draw fields to true in the childs mission progress
 * @param {int} child_id the number id of the child
 * @param {string} field the field being updated (read, write, or draw)
 * @returns {Promise} promise that resolves to the updated mission progress object
 */
const updateProgress = async (child_id, field) => {
  const change = {};
  change[field] = true;
  return db('Mission_Progress')
    .where({ child_id })
    .first()
    .update(change)
    .returning('*');
};

module.exports = {
  findAll,
  findById,
  remove,
  getChildSubmissions,
  getCurrentMission,
  addDrawing,
  addWriting,
  getArchive,
  getMissionProgress,
  createMissionProgress,
  nextMission,
  updateProgress,
};
