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
  for (let i of submitted) {
    pr.push(await fetchItem(i));
  }

  const raw = await Promise.all(pr);

  const comments = raw.filter(e => e.type === 'comment');

  return comments.map(each => ({
    id: each.id,
    type: each.type,
    time: each.time || '',
    text: each.text || 'N/A',
    by: each.by || '',
    kids: each.descendants > 0 ? each.kids : [],
    parent: each.parent || ''
  }));
};
