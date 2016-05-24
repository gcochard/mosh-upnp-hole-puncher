#!/usr/bin/env node
var exec = require('child_process').exec;
var fs = require('fs');
var util = require('util');
var debug = util.debuglog('mosh');
function getIp(){
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }
  return null;
}

debug('ip: %s', getIp());

exec('mosh-server new', function(err,stdout,stderr){
    // output has 1 newline and then the MOSH CONNECT string
    var re = /^MOSH CONNECT (6\d{4}) ([!-~]+)$/;
    var matches = stdout.split('\n').map(function(s){ var m = s.match(re); return m?m[1]:''; }).join('');
    debug('matches: %j', matches);
    if(matches){
      var port = matches;
      var ip = getIp();
      debug('port: %s, ip: %s',port, ip);
      if(ip){
        // this happens async, but works quickly enough to not be a big deal
        // mosh just picks up when the hole is punched
        exec('upnpc -e mosh -a '+ip+' '+port+' '+port+' UDP');
      }
    }
    process.stdout.write(stdout);
    process.stderr.write(stderr);
});
