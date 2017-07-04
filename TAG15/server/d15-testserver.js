console.log( 'Hallo Server Welt' );

var http = require( 'http' );
var server = http.createServer( function( req, res ) {
  res.writeHead( 200, {'Content-Type':'text/html' });
  res.write( 'Hallo, ich bin ein Server!<br>' );
  res.write( req.url );
  res.end();
} );
server.listen( 3000 );
console.log( 'Server läuft auf Localhost Port 3000.');
