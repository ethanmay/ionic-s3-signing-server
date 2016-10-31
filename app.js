require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);
app.listen(process.env.PORT || 3000);

const S3_BUCKET = process.env.S3_BUCKET;

app.post('/sign-s3', (req, res) => {

  var expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();
  var policy = {
    "expiration": expiration,
    "conditions": [
        {"bucket": S3_BUCKET},
        ["eq", "$key", req.body.name],
        {"acl": 'public-read'},
        ["starts-with", "$Content-Type", ""]
    ]
  };

  var policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
  var signature = crypto.createHmac('sha1', process.env.AWS_SECRET_ACCESS_KEY).update(policyBase64).digest('base64');
  const returnData = {
    bucket: S3_BUCKET,
    key: process.env.AWS_ACCESS_KEY_ID,
    policy: policyBase64,
    signature: signature
  };
  res.json(returnData);
});