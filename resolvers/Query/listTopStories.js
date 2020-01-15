const { fetchItem, fetchTopStories } = require('./../../utils/api/hn');

module.exports = async (parent, args, ctx, info) => {
  const { limit } = args;

  const ids = await fetchTopStories();

  const stories = [];

  let arr = [];
  if (limit) {
    arr = ids.slice(0, limit);
  } else {
    arr = ids;
  }

  for (let id of arr) {
    stories.push(await fetchItem(id));
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
