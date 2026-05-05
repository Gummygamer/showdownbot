'use strict';

var http = require('http');
var https = require('https');
var querystring = require('querystring');
var url = require('url');

function post(options, callback) {
	var endpoint = options.url || options.uri;
	if (!endpoint) {
		throw new Error('request.post requires a url option');
	}

	var parsed = url.parse(endpoint);
	var body = querystring.stringify(options.formData || options.form || {});
	var transport = parsed.protocol === 'https:' ? https : http;
	var req = transport.request({
		protocol: parsed.protocol,
		hostname: parsed.hostname,
		port: parsed.port,
		path: parsed.path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(body)
		}
	}, function(response) {
		var responseBody = '';
		response.setEncoding('utf8');
		response.on('data', function(chunk) {
			responseBody += chunk;
		});
		response.on('end', function() {
			callback(null, response, responseBody);
		});
	});

	req.on('error', function(err) {
		callback(err);
	});
	req.write(body);
	req.end();
}

module.exports = {
	post: post
};
