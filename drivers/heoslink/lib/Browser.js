"use strict";

var http = require('http');
var util = require('util');
var EventEmitter = require('events').EventEmitter
var Client = require('node-ssdp').Client;
var client = new Client();
var devices = {};

var Browser = function () {
    console.log('HEOS Link - Device - Browser initialising');
}

module.exports.Browser = Browser;
util.inherits(Browser, EventEmitter)

Browser.prototype.search = function () {
    var self = this
    client.on('response', function (headers, statusCode, rinfo) {
        console.log('Response:' + rinfo);
        if (statusCode !== 200) {
            return;
        }
        if (!headers.LOCATION) {
            return;
        }

        http.get(headers.LOCATION, function (res) {
            var body = ''
            res.on('data', function (chunk) {
                body += chunk
            })
            res.on('end', function () {

                var match = body.match(/<friendlyName>(.+?)<\/friendlyName>/)
                if (!match || match.length !== 2) {
                    return;
                }

                var name = match[1]
                var host = rinfo.address

                if (!devices[name]) {
                    //New device
                    devices[name] = {name: name, host: host}
                } else if(!devices[name].host) {
                    //Update device
                    devices[name].host = host
                }
                self.update({name: name, host: host});
            });
        });
    });

    client.search('urn:schemas-denon-com:device:ACT-Denon:1');
    console.log('HEOS Link - Device - Browser searching');
}

Browser.prototype.update = function (device) {
    console.log('HEOS Link - Device - Browser found' + device.name + '(' + device.host + ')');
    this.emit('deviceOn', device);
}


