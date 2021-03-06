const Err = require('./errors').Errors;
const url = require('url');

const posts = {
  "POST": "/create",
  "PUT": "/update",
  "DELETE": "/delete"
}

function parseBodyJson(req, cb) {
  let body = [];

  try{
    if(req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE'){
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = body.length > 0 ? Buffer.concat(body).toString() : "{}";
        let params = JSON.parse(body);
        cb(null, params, req.url + posts[req.method]);
      });
    }
    else if(req.method === "GET"){
      let url_parts = url.parse(req.url, true);
      let url_path = url_parts.pathname;
      if(url_path === "/articles"){
        url_path += "id" in url_parts.query ? "/read" : "/readall";        
      }
      cb(null, url_parts.query, url_path);
    }
    else{
      throw Error;
    }
  }
  catch(Error){
    cb(Err[400], {});
  }
}

module.exports.parseBodyJson = parseBodyJson;