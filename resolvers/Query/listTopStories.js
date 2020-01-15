const axios = require('axios');

module.exports = async (parent, args, ctx, info) => {
  const { limit } = args;

  const ids = await axios
    .get('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(res => res.data);

  const stories = [];

  let arr = [];
  if (limit) {
    arr = ids.slice(0, limit);
  } else {
    arr = ids;
  }

  for (let id of arr) {
    // limit the return, save time
    stories.push(
      await axios
        .get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
          timeout: 1000000,
          maxContentLength: 1000000
        })
        .then(res => res.data)
    );
  }

  const raw = await Promise.all(stories);

  return raw.map(each => ({
    id: each.id,
    type: each.type || 'story',
    deleted: each.deleted || false,
    time: each.time || '',
    text: each.text || 'N/A',
    dead: each.dead || false,
    url: each.url || '',
    score: each.score || 0,
    title: each.title || '',
    by: each.by || '',
    kids: each.descendants > 0 ? each.kids : []
  }));
};
