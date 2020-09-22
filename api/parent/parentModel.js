const db = require('../../data/db-config');

const findAll = async () => {
  return await db('Parent');
};

const findBy = (filter) => {
  return db('Parent').where(filter);
};

const findById = async (id) => {
  return db('Parent').where({ id }).first().select('*');
};

const create = async (parentObj) => {
  return db('Parent').insert(parentObj).returning('*');
};

const update = (id, changes) => {
  console.log(changes);
  return db('Parent').where({ id: id }).first().update(changes).returning('*');
};

const remove = async (id) => {
  return await db('Parent').where({ id }).del();
};

const findOrCreateParent = async (parentObj) => {
  const foundParent = await findById(parentObj.id).then((Parent) => Parent);
  if (foundParent) {
    return foundParent;
  } else {
    return await create(parentObj).then((newParent) => {
      return newParent ? newParent[0] : newParent;
    });
  }
};

const createChild = async (childObj) => {
  newChildId = await db('Child')
    .insert(childObj)
    .returning('id');
  return await db('Child').where({id: newChildId[0]}).first().select('id', 'name', 'writing_score', 'current_mission', 'avatar_url');
};

const getNamesAndIDS = async (id) => {
  children =  await db('Child').where({ parent_id: id }).select('id', 'name', 'type',);
  parent = await db('Parent').where({id}).select('id', 'name', 'type',).first();
  returnArr = [
    parent,
    ...children
  ];
  console.log(children, 'children');
  console.log(parent, 'parent');
  console.log(returnArr, 'return');
  return returnArr;

};

const getChildData = async (id) => {
  return await db('Child')
    .where({ parent_id: id })
    .select('id', 'name', 'writing_score', 'current_mission', 'avatar_url');
};

module.exports = {
  findAll,
  findBy,
  findById,
  create,
  update,
  remove,
  findOrCreateParent,
  createChild,
  getNamesAndIDS,
  getChildData,
};
