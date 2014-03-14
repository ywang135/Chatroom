var express = require('express');
var app = express();
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://chatroom.db');
var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname+"/views"); // tell Express where to find templates


app.use(express.bodyParser()); // definitely use this feature

app.get('/', function(request,response){
    response.render('index.html');
    
});
// your app's code here
function generateRoomIdentifier() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var result = '';
    for (var i = 0; i < 6; i++)
    	result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}
app.get('/nickname.html', function(request, response){
	console.log("right!");
    response.render('nickname.html', {roomName: name});
});	

app.post('/nickname.html', function(request, response){
	var sql = 'SELECT nickname FROM message WHERE nickname=$1';
    var q = conn.query(sql,[nickname], function(error, result){
    	if(error){
    		console.log("Nickname has already existed!");
    	}
    	else{
    		var nickname = request.body.nickName;
    		var name = generateRoomIdentifier();
    		
			var sql = 'INSERT INTO room VALUES ($1, $2)';
			var q = conn.query(sql, [name, 0], function(error,result) {
				if(error){
					name = generateRoomIdentifier();
					console.log("hello!");
				}
    		});
    	}
    }); 
});


///////////////////
app.post('/:roomName', function(request, response){
	var roomName  = request.params.roomName;
	var nickname = request.body.nickName; // 'Miley'
   	var message = request.body.message;
   	console.log(nickname + " " + message);
    response.render('newroom.html', 
    {
    	roomName: roomName,
    	nickName: nickname
    });
});
app.get('/:roomName/messages', function(request, response){
    response.setHeader('Refresh', '5'); //refresh every 5 seconds
    response.render('newroom.html', 
    {
    	roomName: roomName,
    	nickName: nickname
    });
    // go on about your business
});
app.post('/:roomName/messages', function(request, response){
   	var name = request.params.roomName;   // 'ABC123'
   	var nickname = request.body.nickName; // 'Miley'
   	var message = request.body.message;
    var time = new Date();
    conn.query('INSERT INTO messages(roomname, nickname, body, time) VALUES ($1, $2, $3, $4)', [name, nickname, message, time]).on('error',console.error);	
});
/*
app.post('/:roomName', function(request, response){
    var sql = 'SELECT nickname FROM message WHERE nickname=$1';
    var q = conn.query(sql,[nickname], function(error, result){
    	if(error){
    		console.log("Nickname has already existed!");
    		response.render('nickname.html', {roomName: name});
    	}
    	else{
			var name = request.params.roomName;   // 'ABC123'
   			var nickname = request.body.nickName; // 'Miley'
   			var message = request.body.message;
    		var time = new Date();
    		conn.query('INSERT INTO messages(roomname, nickname, body, time) VALUES ($1, $2, $3, $4)', [name, nickname, message, time]);	
    	}
    });    
});
app.get('/:roomName', function(request, response){
    response.render('newroom.html', {roomName: roomName});
});
app.get('/:roomName/messages', function(request, response){
   //   response.setHeader('Refresh', '5'); refresh every 5 seconds
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("You made it!");
    // go on about your business
});

app.get('/:roomName/messages.json', function(request, response){
    // fetch all of the messages for this room
    var messages = [{nickname: 'Miley', body: 'It\'s our party we can do what we want'}, ...];

    // encode the messages object as JSON and send it back
    response.json(messages);
});*/
app.listen(8080);