const server = { host: '0.0.0.0', port: 4444 };
const serverUrl = `http://${server.host}:${server.port}`;
module.exports = {
  secretKey: '1',
  proxy: {
    '/socket.io': {
      ws: true,
      target: serverUrl,
      secure: false,
    },
    '/api': {
      target: serverUrl,
      secure: false,
    }
  },
  server: server,
  db: {
    host: '0.0.0.0',
    port: 27017,
    options:{
      auto_reconnect: true,
      poolSize: 10, 
      w: 1, 
      strict: true, 
      native_parser: true
    },
    database: 'timetrack',
  },
}
