const Storage = require('electron-store');
const dotProp = require('dot-prop');

const defaults = {
  config: {
    node: {
      list: [
        {
          name: 'mainnet-node1',
          server: 'http://47.102.121.72:30315',
          chainId: 10,
          itcContract: '0x2ca70e7d0c396c36e8b9d206d988607a013483cf'
        },
        {
          name: 'mainnet-node2',
          server: 'http://47.116.16.174:30315',
          chainId: 10,
          itcContract: '0x2ca70e7d0c396c36e8b9d206d988607a013483cf'
        },
        {
          name: 'mainnet-node3',
          server: 'http://47.103.148.95:30315',
          chainId: 10,
          itcContract: '0x2ca70e7d0c396c36e8b9d206d988607a013483cf'
        },
        {
          name: 'testnet-node1',
          server: 'http://139.224.255.21:30315',
          chainId: 100,
          itcContract: '0x866f68430344fb1a0b0271c588abae123a8c31dd',
          testnet: true
        }
      ],
      current: {
        name: 'mainnet-node1',
        server: 'http://47.102.121.72:30315',
        chainId: 10,
        itcContract: '0x2ca70e7d0c396c36e8b9d206d988607a013483cf'
      }
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

storage.getWorkaround = function (key, defaultValue) {
  var v = storage.get(key, defaultValue);
  return typeof v == "undefined" ? dotProp.get(storage._defaultValues, key, defaultValue) : v;
};

export default storage

