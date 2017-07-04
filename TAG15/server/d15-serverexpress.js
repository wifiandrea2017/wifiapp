console.log( 'Server mit Express' );
/* mein 1. Webserver */
var express = require( 'express' );
var fs = require( 'fs' );
var bp = require( 'body-parser' );
var app = express();

//Startet Server auf Port...
var server = app.listen(3000, function() {
  console.log( 'Server läuft auf Port 3000' );
});

//bestimmte Requests "durchschleifen"
app.use( express.static( 'files' ) );

// POST DATEN kommen URL ENCODED
app.use( bp.urlencoded({extended:true} ));
//app.use( bp.json() );

// CORS, erlaube Zugriff von außerhalb des Servers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Anfrage an den Server mit GET
app.get( '/', function(req,res) {
  res.writeHead( 200, { 'Content-Type':'text/html' });
  res.end( 'hier kommt jetzt HTML...' );
});

app.get( '/wifi', function(req,res) {
  res.writeHead( 200, { 'Content-Type':'text/html' });
  res.end( 'Wissen ist für immer!' );
});

app.get( '/test', function(req,res) {
  // File einlesen
  fs.readFile( 'd15-test.html', function( err, data ) {
    if ( !err ) {
      res.writeHead( 200, { 'Content-Type':'text/html' });
      console.log( data );
      res.end( data );
    }
  });
});

// POST Anfrage x2 und Antworte mit JSON
app.post('/x2', function(req,res){
  res.writeHead( 200, { 'Content-Type':'application/json' });
  if ( req.body.type == 'abc' ) {
    var response = { x2: req.body.x * req.body.x };
    res.end( JSON.stringify( response ) );
  }
});


// Restful für "user" ----------------------------------------
var appREST = express();
appREST.listen( 3333, function() {
  console.log( 'REST-Webservice läuft auf Port 3333.' );
});

appREST.use( bp.urlencoded({extended:true} ));

// CORS, erlaube Zugriff von außerhalb des Servers
appREST.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE' );
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// alle User abfragen
appREST.get( '/user', function(req,res) {
  fs.readFile( 'userdb.json', function(err,data) {
    if ( !err ) {
      var inhaltFile = JSON.parse(data);
      var alleUser = inhaltFile.users; // ARRAY
      res.writeHead( 200, { 'Content-Type':'application/json'}); // muss in jQuery nicht mehr geparst werden
      res.end( JSON.stringify( inhaltFile ) );
    }
  });
});

//einen User abfragen
appREST.get( '/user/:id', function(req,res) {
  var id = req.params.id;
  fs.readFile( 'userdb.json', function(err,data) {
    if ( !err ) {
      var inhaltFile = JSON.parse(data);
      var alleUser = inhaltFile.users; // ARRAY
      if ( !alleUser[ id ] ) {
        // gibt den User nicht
        res.writeHead( 404, { 'Content-Type':'text/html'});
        res.end( 'User not exist.' );
      } else {
        // gibt den user
        res.writeHead( 200, { 'Content-Type':'application/json'});
        res.end( JSON.stringify( {'user':alleUser[ id ] } ) );
      }
    }
  });
});

//neuen User anlegen
appREST.post( '/user', function(req,res) {
  var datenUser = req.body;
  fs.readFile( 'userdb.json', function(err,data) {
    if ( !err ) {
      var inhaltFile = JSON.parse(data);
      var alleUser = inhaltFile.users; // ARRAY
      alleUser.push( datenUser );
      fs.writeFile( 'userdb.json', JSON.stringify(
        {"users":alleUser}
      ));
      res.writeHead( 200, { 'Content-Type':'application/json'});
      res.end( JSON.stringify(
        { id: alleUser.length-1 }
      ) );
    }
  });
});

//User veränden
appREST.put( '/user/:id', function(req,res) {
  var id = req.params.id;
  var datenUser = req.body;
  fs.readFile( 'userdb.json', function(err,data) {
    if ( !err ) {
      var inhaltFile = JSON.parse(data);
      var alleUser = inhaltFile.users; // ARRAY
      alleUser[id] = datenUser;
      fs.writeFile( 'userdb.json', JSON.stringify(
        {"users":alleUser}
      ));
      res.writeHead( 200, { 'Content-Type':'application/json'});
      res.end( JSON.stringify(
        { result:'changed' }
      ) );
    }
  });


});

//User löschen
appREST.delete( '/user/:id', function(req,res) {
  var id = req.params.id;
  fs.readFile( 'userdb.json', function(err,data) {
    if ( !err ) {
      var inhaltFile = JSON.parse(data);
      var alleUser = inhaltFile.users; // ARRAY
      alleUser[id] = {};
      fs.writeFile( 'userdb.json', JSON.stringify(
        {"users":alleUser}
      ));
      res.writeHead( 200, { 'Content-Type':'application/json'});
      res.end( JSON.stringify(
        { result:'deleted' }
      ) );
    }
  });
});




// Restful für "places" ----------------------------------------
var appRESTPlaces = express();
appRESTPlaces.listen( 5432, function() {
  console.log( 'REST-Webservice für Places läuft auf Port 5432.' );
});

appRESTPlaces.use( bp.urlencoded({extended:true} ));

// CORS, erlaube Zugriff von außerhalb des Servers
appRESTPlaces.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET, POST, PUT, DELETE' );
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// alle Places abfragen
appRESTPlaces.get( '/places', function(req,res) {
  fs.readFile( 'places.json', function(err,data) {
    if ( !err ) {
      var inhaltFile = JSON.parse(data);
      // FILE {"places":[...]}    
      var allPlaces = inhaltFile.places; // ARRAY
      res.writeHead( 200, { 'Content-Type':'application/json'}); // muss in jQuery nicht mehr geparst werden
      res.end( JSON.stringify( inhaltFile ) );
    }
  });
});

//einen Places abfragen
appRESTPlaces.get( '/places/:id', function(req,res) {
  var id = req.params.id;
  fs.readFile( 'places.json', function(err,data) {
    if ( !err ) {
      var inhaltFile = JSON.parse(data);
      var allPlaces = inhaltFile.places; // ARRAY
      if ( !allPlaces[ id ] ) {
        // gibt den Place nicht
        res.writeHead( 404, { 'Content-Type':'text/html'});
        res.end( 'Place not exist.' );
      } else {
        // gibt den Place
        res.writeHead( 200, { 'Content-Type':'application/json'});
        res.end( JSON.stringify( {'place':allPlaces[ id ] } ) );
      }
    }
  });
});

//neuen Places anlegen
appRESTPlaces.post( '/places', function(req,res) {
  var datenPlaces = req.body;
  fs.readFile( 'places.json', function(err,data) {
    if ( !err ) {
      var inhaltFile = JSON.parse(data);
      var allPlaces = inhaltFile.places; // ARRAY
      allPlaces.push( datenPlaces );
      fs.writeFile( 'places.json', JSON.stringify(
        {"places":allPlaces}
      ));
      res.writeHead( 200, { 'Content-Type':'application/json'});
      res.end( JSON.stringify(
        { id: allPlaces.length-1 }
      ) );
    }
  });
});

//Places veränden
appRESTPlaces.put( '/places/:id', function(req,res) {
  var id = req.params.id;
  var datenPlaces = req.body;
  fs.readFile( 'places.json', function(err,data) {
    if ( !err ) {
      var inhaltFile = JSON.parse(data);
      var allPlaces = inhaltFile.places; // ARRAY
      allPlaces[id] = datenPlaces;
      fs.writeFile( 'places.json', JSON.stringify(
        {"places":allPlaces}
      ));
      res.writeHead( 200, { 'Content-Type':'application/json'});
      res.end( JSON.stringify(
        { result:'changed' }
      ) );
    }
  });


});

//Places löschen
appRESTPlaces.delete( '/places/:id', function(req,res) {
  var id = req.params.id;
  fs.readFile( 'places.json', function(err,data) {
    if ( !err ) {
      var inhaltFile = JSON.parse(data);
      var datenPlaces = inhaltFile.places; // ARRAY
      datenPlaces[id] = {};
      fs.writeFile( 'places.json', JSON.stringify(
        {"places":datenPlaces}
      ));
      res.writeHead( 200, { 'Content-Type':'application/json'});
      res.end( JSON.stringify(
        { result:'deleted' }
      ) );
    }
  });
});
