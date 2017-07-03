let userKey = 'adroi.adm';
let tokenKey = 'adroi.adm.token';
let timestampKey = 'adroi.adm.timestamp';
let lastPathKey = 'adroi.adm.lastPath';
let session = Object.create({
    getUser () {
      var user = localStorage.getItem(userKey);
      return user ? JSON.parse(user) : null;
    },
    setUser (user) {
      var token = user ? user.token : null;
      token && this.setToken(token);
      delete user.token;
      localStorage.setItem(userKey, JSON.stringify(user));
    },
    getToken () {
      var token = localStorage.getItem(tokenKey);
      return token || null;
    },
    setToken (token) {
      localStorage.setItem(tokenKey, token);
    },
    setLastPath (path) {
      localStorage.setItem(lastPathKey, path);
    },
    getLastPath () {
      var path = localStorage.getItem(lastPathKey);
      return path || false;
    },
    getTimestamp () {
      var timestamp = localStorage.getItem(timestampKey);
      return +(timestamp || 0);
    },
    setTimestamp (timestamp) {
      timestamp = timestamp || 0;
      localStorage.setItem(timestampKey, timestamp);
    },
    resetTimestamp () {
      this.setTimestamp(+(new Date()));
  },
  isLogin () {
    var user = this.getUser();
    if (!user) {
      return false;
    }
    var initTimestamp = this.getTimestamp();
    if (initTimestamp === 0) {
      return false;
    }
    var nowTimestamp = +(new Date());
    var delta = 6 * 60 * 60 * 1000;
    if (initTimestamp + delta > nowTimestamp) {
      return true;
    }
    return false;
  },
  clear: function () {
    localStorage.removeItem(userKey);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(lastPathKey);
    localStorage.removeItem(timestampKey);
  }
});

export default session;
