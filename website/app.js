const spdy = require("spdy")
const express = require("express")
const fs = require("fs")
const path = require('path');
const request = require('request');
const axios = require('axios');
const app = express()


let cdn = 'https://localhost:3001';

app.use(async (req, res, next) => {
    let domain = req.get('cdn');
    console.log('req url', req.url);
    let allowedURL = ['/', '/index.html', '/contact.html', '/single.html'];
    if((domain === cdn) || (allowedURL.includes(req.url))){
        console.log('cdn matched')
        next();
    }
    else{
        if(res.push){
          let cdnURL = cdn+req.url;
          console.log('cdn URL', cdnURL, req.headers);
          request(cdnURL).pipe(res);
          // next();
        }
    }
})

app.use(express.static(path.join(__dirname, 'public')));
app.get("*", async (req, res) => {
    res.end(fs.readFileSync(__dirname + "/public/index.html"));
})

spdy.createServer(
  {
    key: fs.readFileSync("./server.key"),
    cert: fs.readFileSync("./server.crt")
  },
  app
).listen(3002, (err) => {
  if(err){
    throw new Error(err)
  }
  console.log("Moon website Listening on port 3002")
})
