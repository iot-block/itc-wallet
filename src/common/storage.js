const Storage = require('electron-store');

const defaults = {
  config: {
    node: {
      list: [
        'http://47.102.121.72:30315',
        'http://139.196.160.72:30315',
        'http://139.196.160.93:30315'
      ],
      current: 'http://47.102.121.72:30315'
    },
    language: 'zh'
  },
  wallet: {
    list: []
  },
}

const storage = new Storage({
  defaults
});

export default storage