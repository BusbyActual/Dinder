var config = require('../../config');
var s3Policy = require('s3-policy-middleware').default;

module.exports.sendPolicy = s3Policy({
  NAME_PREFIX: config.S3_NAME_PREFIX,
  BUCKET: config.S3_BUCKET,
  REGION: config.S3_REGION,
  ACCESS_KEY_ID: config.S3_ACCESS_KEY,
  SECRET_ACCESS_KEY: config.S3_SECRET_KEY
});
