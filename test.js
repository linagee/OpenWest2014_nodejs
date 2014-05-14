var async = require('async');
var usb = require('usb');

var openWestDevice = usb.findByIds('0x16C0', '0x05DF');
openWestDevice.open();
var buffer = new Buffer(255);
var write = function(byte, callback) {
   openWestDevice.controlTransfer(32, 9, 768, byte, buffer, callback);
}

var changeColor = function(led, R, G, B, callback) {
   async.series([
      function(cb) { write(42, cb); },
      function(cb) { write(led, cb); },
      function(cb) { write(R, cb); },
      function(cb) { write(G, cb); },
      function(cb) { write(B, cb); }
   ], callback);
};

var setBrightness = function(brightness, callback) {
   async.series([
      function(cb) { write(42, cb); },
      function(cb) { write(255, cb); },
      function(cb) { write(brightness, cb); }
   ], callback);
};

setBrightness(2, function() {
   changeColor(0, 128, 0, 255, function() {
      changeColor(1, 0, 255, 128, function() {
         changeColor(2, 255, 128, 0, function() {
            changeColor(3, 255, 255, 255);
         });
      });   
   });
});