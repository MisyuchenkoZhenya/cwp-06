const Err = require('./errors').Errors;

function parseBodyJson(req, cb) {
  let body = [];

  try{
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = body.length > 0 ? Buffer.concat(body).toString() : "{}";
      let params = JSON.parse(body);
      cb(null, params);
    });
  }
  catch(Error){
    cb(Err[400], {});
  }
}

module.exports.parseBodyJson = parseBodyJson;