var fs = require( 'fs' );
var cp = require( 'child_process' );

var serverFile = 'd15-serverexpress.js';

var server = cp.fork( serverFile );
console.log( 'Serverstart-Script gestartet.' );

fs.watchFile( serverFile, function( event, filename ) {
  server.kill();
  console.log( 'Server '+serverFile+' stopped.' );
  server = cp.fork( serverFile );
  console.log( 'Server '+serverFile+' restarted.' );
} );
