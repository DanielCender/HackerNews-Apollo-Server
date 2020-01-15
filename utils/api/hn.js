const axios = require('axios');

const instance = axios.create({
  baseURL: 'https://hacker-news.firebaseio.com/v0',
  timeout: 1000000,
  maxContentLength: 1000000
});

const fetchUser = id => instance.get(`/user/${id}.json`).then(res => res.data);

const fetchItem = id => instance.get(`/item/${id}.json`).then(res => res.data);

const fetchTopStories = () => instance.get(`/topstories.json`).then(res => res.data);

module.exports = {
  fetchUser,
  fetchItem,
  fetchTopStories
};
