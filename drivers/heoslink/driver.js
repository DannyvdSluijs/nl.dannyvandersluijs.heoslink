"use strict";

var os = require('os');
var net = require('net');
var Browser = require('./lib/Browser.js').Browser;

var devices = [];

module.exports.init = function (devices, callback) {
    console.log("HEOS Link app - Driver - Initialised");
    discoverHEOSLinks();
    callback();
};

function discoverHEOSLinks() {
    var browser = new Browser();
    browser.on('deviceOn', function(device) {
        devices.push(device);
    });
    browser.search();
};

module.exports.capabilities = {
    play: {
        get: function (device_data, callback) {
            if (typeof callback == 'function') {
                callback(null, "Don't stop the music");
            }
        },
        set: function (device_data, play, callback) {
            if (typeof callback == 'function') {
                callback(null, "Don't stop the music");
            }
        }
    },
};

module.exports.pair = function( socket ) {
    socket.on('list_devices', function(data, callback) {
        callback(null, devices.map(function(heoslink) {
            return {
                name: heoslink.name,
                data: {
                    id: heoslink.name,
                    ip: heoslink.host
                }
            };
        }));
    });
};


