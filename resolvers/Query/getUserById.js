const { fetchUser } = require('./../../utils/api/hn');

module.exports = async (parent, args, ctx, info) => {
  const { id } = args;

  const res = await fetchUser(id);

  return {
    id: res.id,
    created: res.created || '',
    karma: res.karma || 0,
    about: res.about || ''
  };
};
