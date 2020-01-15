const getComments = require('./comments');
const getUser = require('./user');

module.exports = {
  comments: getComments,
  by: getUser
};
