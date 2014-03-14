var express = require('express');
var app = express();
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://chatroom.db');
var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname+ "/views"); // tell Express where to find templates

app.use(express.bodyParser());

function generateRoomIdentifier() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var result = '';
    for (var i = 0; i < 6; i++)
    	result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}
app.get('/', function(request,response){
	response.render('index.html');
	var sql = 'SELECT DISTINCT room FROM messages WHERE time >= strftime('%s','now') - 300';
    var q = conn.query(sql);
    q.on('row', function(row){
        response.write("Room Name: "+row.roomname);
    });
});
app.post('/',function(request,response){
    
	var name = generateRoomIdentifier();
	var sql = 'INSERT INTO room VALUES ($1, $2)';
	var q = conn.query(sql, [name, 0], function(error,result) {
		if(error){
			name = generateRoomIdentifier();
			console.log("hello!");
		}
		else{
			console.log(name);
			response.render('room.html', {roomName: name});
		}
    });
});
app.get('/:roomName',function(request,response){
    var i = 0;
    var name = request.params.roomName;
    var q = conn.query('SELECT name FROM room WHERE name = $1', [name]);
    q.on('row', function(row){
        i++;
    });
    q.on('end', function(){
        if(i>0){
		  response.render('room.html', {roomName: name});
	   }
	   else{
          response.render('index.html', {error_info:"No room name, you can create a new room here!"});
       }
		
    });
});
app.post('/:roomName',function(request,response){
    var nickname = request.body.nickname;
    var roomName = request.params.roomName;
	var sql = 'INSERT INTO users VALUES ($1)';
    var q = conn.query(sql,[nickname], function(error, result){
    	if(error){
    		console.log("exist!");
            response.render('room.html', {roomName: roomName, error_info:"user name exist"});
    	}
    	else{
            var newsql = 'UPDATE room SET numofPeople=numofPeople+1 WHERE name = $1';
            var q1 = conn.query(newsql, [roomName]).on('error',console.error);
            response.render('message.html', {roomName: request.params.roomName, nickName: nickname});
    	}
    });

});
app.post('/:roomName/messages',function(request,response){
	var name = request.params.roomName;   // 'ABC123'
   	var nickname = request.body.nickName; // 'Miley'
   	var message = request.body.message;
    var time = new Date();
    conn.query('INSERT INTO messages(roomname, nickname, body, time) VALUES ($1, $2, $3, $4)', [name, nickname, message, time]).on('error',console.error);	
    response.redirect('/' + name);
    console.log('made it!');

});

app.get('/:roomName/messages.json', function(request, response){
    var name = request.params.roomName;
    var sql = 'SELECT id, nickname, body, time FROM messages WHERE roomname=$1';
    var q = conn.query(sql, [name]);
    var messages = [];
    q.on('row', function(row){
        var temp = {
            id: row.id,
	        body: row.body,
            nickname: row.nickname,
            time: row.time
        };
        messages.push(temp);
        console.log(messages[0].body);
    });
    response.json(messages);
    /*var messages = [{nickname: 'Miley', body: 'It\'s our party we can do what we want'},{nickname: 'Miley', body: 'It\'s our party we can do what we want'}];
    response.json(messages);*/
});
app.listen(8080);