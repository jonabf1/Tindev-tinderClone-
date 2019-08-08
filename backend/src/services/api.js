const axios = require('axios');

const api = axios.create({
    baseURL: 'https://api.github.com/users'
})

module.exports = api;
