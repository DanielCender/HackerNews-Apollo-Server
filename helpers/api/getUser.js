const axios = require('axios');

module.exports = async (parent, args, context, info) => {
  console.log(parent);
  const { by } = parent;

  const res = await axios
    .get(`https://hacker-news.firebaseio.com/v0/user/${by}.json`)
    .then(res => res.data);

  return {
    id: res.id,
    created: res.created || '',
    karma: res.karma || 0,
    about: res.about || ''
  };
};
