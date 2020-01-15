const axios = require('axios');

module.exports = async (parent, args, ctx, info) => {
  const { id } = args;

  const res = await axios
    .get(`https://hacker-news.firebaseio.com/v0/user/${id}.json`)
    .then(res => res.data);

  return {
    id: res.id,
    created: res.created || '',
    karma: res.karma || 0,
    about: res.about || ''
  };
};
