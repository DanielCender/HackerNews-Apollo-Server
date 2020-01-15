const axios = require('axios');

module.exports = async (parent, args, ctx, info) => {
  const { id } = parent;
  const { limit } = args;

  const res = await axios
    .get(`https://hacker-news.firebaseio.com/v0/user/${id}.json`)
    .then(res => res.data);

  let submitted = [];
  if (limit) {
    submitted = res.submitted.slice(0, limit);
  } else {
    submitted = res.submitted;
  }

  const pr = [];
  // handle all submitted []
  for (let i of submitted) {
    pr.push(
      await axios.get(`https://hacker-news.firebaseio.com/v0/item/${i}.json`).then(res => res.data)
    );
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
