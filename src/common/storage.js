const Storage = require('electron-store');

const defaults = {
  node: {
    list: [
      '192.168.1.1:30315',
      '192.168.1.2:30315'
    ],
    current: '192.168.1.1:30315'
  },
  keystore: [],
  language: 'zh'
}

const storage = new Storage({
  defaults
});

export default storage