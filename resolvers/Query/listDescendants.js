const axios = require('axios');

module.exports = async (parent, args, context, info) => {
  const { id } = args;
  const pr = [];

  const raw = await axios
    .get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then(res => res.data);

  for (let i of raw.kids || []) {
    pr.push(
      await axios.get(`https://hacker-news.firebaseio.com/v0/item/${i}.json`).then(res => res.data)
    );
  }
  const res = await Promise.all(pr);

  // Need to filter out all dead or deleted, and where there's no text/author
  return res
    .filter(e => (!e.dead || !e.deleted) && e.text && e.by)
    .map(each => ({
      id: each.id,
      by: each.by || '',
      type: each.type || 'comment',
      time: each.time || '',
      text: each.text || 'N/A',
      kids: each.descendants > 0 ? each.kids : []
    }));
};
