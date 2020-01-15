const axios = require('axios');

module.exports = async (parent, args, context, info) => {
  const { kids } = parent;
  const pr = [];

  for (let i of kids) {
    pr.push(
      await axios.get(`https://hacker-news.firebaseio.com/v0/item/${i}.json`).then(res => res.data)
    );
  }
  const res = await Promise.all(pr);

  return res.map(each => ({
    id: each.id,
    type: each.type || 'comment',
    by: each.by || '',
    time: each.time || '',
    text: each.text || 'N/A',
    kids: each.descendants > 0 ? each.kids : []
  }));
};
