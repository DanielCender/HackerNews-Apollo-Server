const { fetchItem } = require('./../../utils/api/hn');

module.exports = async (parent, args, ctx, info) => {
  const { parent: par } = parent;

  const res = await fetchItem(par);

  let obj = {};

  switch (res.type) {
    case 'comment':
      obj = {
        id: res.id,
        type: res.type,
        time: res.time || '',
        text: res.text || 'N/A',
        by: res.by || '',
        parent: res.parent || ''
      };
      break;
    case 'story':
      obj = {
        id: res.id,
        type: res.type,
        deleted: res.deleted || false,
        time: res.time || '',
        text: res.text || 'N/A',
        dead: res.dead || false,
        url: res.url || '',
        score: res.score || 0,
        title: res.title || ''
      };
      break;
    default:
      obj = null;
      break;
  }

  return obj;
};
