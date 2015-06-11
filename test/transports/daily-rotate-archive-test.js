/*
 * daily-rotate-archive-test.js: Tests for instances of the Daily-rotate transport setting the archive option,
 *
 * (C) 2015 Adam Patai
 * MIT LICENSE
 *
 */

var assert = require('assert'),
  exec = require('child_process').exec,
  fs = require('fs'),
  path = require('path'),
  vows = require('vows'),
  winston = require('../../lib/winston'),
  helpers = require('../helpers');

var archiveTransport = new winston.transports.DailyRotateFile({
  timestamp: true,
  json: false,
  zippedArchive: true,
  tailable: true,
  filename: 'dtestarchive.log',
  dirname: path.join(__dirname, '..', 'fixtures', 'logs'),
  maxsize: 4096,
  colorize: false,
  datePattern: '.yyyy-MM-dd.log'
});

function data(ch) {
  return new Array(1018).join(String.fromCharCode(65 + ch));
}

function logKbytes(kbytes, txt) {
  //
  // With no timestamp and at the info level,
  // winston adds exactly 7 characters:
  // [info](4)[ :](2)[\n](1)
  //
  for (var i = 0; i < kbytes; i++) {
    archiveTransport.log('info', data(txt), null, function() {});
  }
}

vows.describe('winston/transports/daily-rotate-file/zippedArchive').addBatch({
  "An instance of the File Transport with tailable true": {
    "when created archived files are rolled": {
      topic: function() {
        var that = this,
          created = 0;

        archiveTransport.on('logged', function() {
          if (++created === 3) {
            return that.callback();
          }

          logKbytes(4, created);
        });

        logKbytes(4, created);
      },
      "should be only 3 files called testarchive.log, testarchive1.log.gz and testarchive2.log.gz": function() {
        //Give the archive a little time to settle
        //  setTimeout(function() {
        for (var num = 0; num < 3; num++) {
          var file = !num ? 'dtestarchive.log' : 'dtestarchive' + num + '.log.gz',
            fullpath = path.join(__dirname, '..', 'fixtures', 'logs', file);

        }
        //},5000);
      }
    }
  }
}).export(module);
