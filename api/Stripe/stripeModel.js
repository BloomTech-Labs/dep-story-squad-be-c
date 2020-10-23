const db = require('../../data/db-config');

const getSubData = async (parentID) => {
  return db('Parent')
    .where({ id: parentID })
    .first()
    .select('stripe_id', 'subscribed', 'sub_id');
};

const newSub = async (parentID, stripeID, subID) => {
  return db('Parent')
    .where({ id: parentID })
    .first()
    .update({
      stripe_id: stripeID,
      sub_id: subID,
    })
    .returning('*');
};

const getParentByStripeID = async (stripeID) => {
  return db('Parent').where({ stripe_id: stripeID }).returning('id');
};

const cancelSub = async (parentID) => {
  return db('Parent')
    .where({ id: parentID })
    .first()
    .update({
      sub_id: null,
      subscribed: false,
    })
    .returning('subscribed');
};

const confirmSub = async (parentID) => {
  return db('Parent')
    .where({ id: parentID })
    .update({
      subscribed: true,
    })
    .returning('subscribed');
};

module.exports = {
  getSubData,
  newSub,
  getParentByStripeID,
  cancelSub,
  confirmSub,
};
