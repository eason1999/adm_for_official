import config from '../config.js';

let api = Object.create({
  url: function (url) {
    if (!config.publish) {
      return url;
    }
    return config.apiServer + url;
  }
});

export default api;
