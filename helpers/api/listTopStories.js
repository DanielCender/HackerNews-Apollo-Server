const axios = require('axios');

module.exports = async () => {
  const ids = await axios
    .get('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(res => res.data);

  const stories = [];
  for (let id of ids) {
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
    by: each.by || '',
    time: each.time || '',
    text: each.text || 'N/A',
    dead: each.dead || false,
    comments: [], // each.kids || [],
    url: each.url || '',
    score: each.score || 0,
    title: each.title || ''
  }));

  // const result = await rawMap.map(async i => {
  //   const pr = [];
  //   if (i.comments.length > 0) {
  //     for (let comment of i.comments) {
  //       pr.push(
  //         await axios
  //           .get(`https://hacker-news.firebaseio.com/v0/item/${comment}.json`)
  //           .then(res => res.data)
  //       );
  //     }
  //     const raw = await Promise.all(pr);
  //     return { ...i, comments: raw };
  //   }
  //   return i;
  // });
  // return result;
};
