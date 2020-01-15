const Comment = require('./Comment');
const Query = require('./Query');
const Story = require('./Story');
const User = require('./User');

module.exports = {
  Listable: {
    __resolveType(obj) {
      if (obj.type === 'story') {
        return 'Story';
      }
      if (obj.type === 'comment') {
        return 'Comment';
      }
      return null;
    }
  },
  Parent: {
    __resolveType(obj) {
      if (obj.type === 'story') {
        return 'Story';
      }
      if (obj.type === 'comment') {
        return 'Comment';
      }
      return null;
    }
  },
  Comment,
  Query,
  Story,
  User
};
