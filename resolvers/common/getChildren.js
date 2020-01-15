const { fetchItem } = require('./../../utils/api/hn');

module.exports = async (parent, args, context, info) => {
  const { kids } = parent;
  const pr = [];

  for (let i of kids) {
    pr.push(await fetchItem(i));
  }
  const res = await Promise.all(pr);

  // !Important to filter out these comments that will lead to graph breakages down the line
  return res
    .filter(e => (!e.dead || !e.deleted) && e.text && e.by)
    .map(each => ({
      id: each.id,
      type: each.type || 'comment',
      by: each.by || '',
      time: each.time || '',
      text: each.text || 'N/A',
      kids: each.descendants > 0 ? each.kids : []
    }));
};
