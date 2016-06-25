export default {

  environment: process.env.NODE_ENV || 'development',

  http: {
    host: process.env.HTTP_HOST || '0.0.0.0',
    port: process.env.HTTP_PORT || '3000',
  },

  oauth2: {
    url: process.env.OAUTH2_SERVICE_URL,
  },

  etcd: {
    hosts: (process.env.ETCD_HOSTS || '').split(/,\s*/),
    key: process.env.ETCD_KEY,
  },

};
