var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');
var http = require('http');

//create redis client
var client = redis.createClient();

//create http server
http.createServer(function (req, res) {
    client.get('awesome', function (error, awesomeCount){
        if (error !== null) {
            //handle error here
            console.log('error: ' + error);
        } else {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('The awesome count is ' + awesomeCount);
        }
    });
}).listen(3000);

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

t.stream(
    'statuses/filter',
    { track: ['awesome', 'cool', 'rad', 'gnarly', 'groovy'] },
    function(stream) {
        stream.on('data', function(tweet) {
            console.log(tweet.text);
            //if awesome is in the tweet text, increment the counter
            //track[].forEach(function(element) {
              //console.log(element);
            //});
            if(tweet.text.match(/awesome/)) {
                client.incr('awesome');
            }
        });
    }
);