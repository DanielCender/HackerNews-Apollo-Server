const { fetchUser } = require('./../../utils/api/hn');

module.exports = async (parent, args, context, info) => {
  const { by } = parent;

  const res = await fetchUser(by);

  return {
    id: res.id,
    created: res.created || '',
    karma: res.karma || 0,
    about: res.about || ''
  };
};
