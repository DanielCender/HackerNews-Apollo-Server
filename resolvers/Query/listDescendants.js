const { fetchItem } = require('./../../utils/api/hn');
const getChildren = require('../common/getChildren');

module.exports = async (parent, args, context, info) => {
  const { id } = args;

  const raw = await fetchItem(id);

  const newParent = {
    kids: raw.kids ? raw.kids : []
  };

  return getChildren(newParent, args, context, info);
};
