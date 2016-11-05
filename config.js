var secrets;

if (process.env.NODE_ENV !== 'production') {
  secrets = require('./secrets.json');
}

module.exports = {
  apiRoot: 'http://ec2-54-187-168-239.us-west-2.compute.amazonaws.com',
  androidLocalRoot: 'http://10.0.2.2',
  iosLocalRoot: 'http://localhost',
  port: 1337,
  yelpRoot: 'https://api.yelp.com/v3/',
  DB_USERNAME: process.env.DB_USERNAME || secrets.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD || secrets.DB_PASSWORD,
  yelpKey: process.env.YELPKEY || secrets.yelpKey,
  DB_NAME: 'dinder',
  DB_ADDRESS_PORT: process.env.DB_ADDRESS_PORT || secrets.DB_ADDRESS_PORT,
  DB_ADDRESS_HOST: process.env.DB_ADDRESS_HOST || secrets.DB_ADDRESS_HOST,
  S3_NAME_PREFIX: process.env.S3_NAME_PREFIX || secrets.S3_NAME_PREFIX,
  S3_REGION: process.env.S3_REGION || secrets.S3_REGION,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || secrets.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY || secrets.S3_SECRET_KEY,
  S3_BUCKET: process.env.S3_BUCKET || secrets.S3_BUCKET,
  JWT_SECRET: process.env.JWT_SECRET || secrets.JWT_SECRET,
  MAPS_KEY: process.env.MAPS_KEY || secrets.MAPS_KEY,
  UBER_CLIENT_SECRET: process.env.UBER_CLIENT_SECRET || secrets.UBER_CLIENT_SECRET,
  UBER_CLIENT_ID: process.env.UBER_CLIENT_ID || secrets.UBER_CLIENT_ID
};
