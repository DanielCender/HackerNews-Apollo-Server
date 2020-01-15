const { fetchItem, fetchUser } = require('./../../utils/api/hn');

module.exports = async (parent, args, ctx, info) => {
  const { id } = parent;
  const { limit } = args;

  const res = await fetchUser(id);

  let submitted = [];
  if (limit) {
    submitted = res.submitted.slice(0, limit);
  } else {
    submitted = res.submitted;
  }

  const pr = [];
  // handle all submitted []
  for (let i of submitted) {
    pr.push(await fetchItem(i));
  }

  const raw = await Promise.all(pr);

  const stories = raw.filter(e => e.type === 'story');

  return stories.map(each => ({
    id: each.id,
    type: each.type,
    deleted: each.deleted || false,
    time: each.time || '',
    text: each.text || 'N/A',
    dead: each.dead || false,
    url: each.url || '',
    score: each.score || 0,
    title: each.title || '',
    kids: each.descendants > 0 ? each.kids : []
  }));
};
