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
app.post('/:roomName',function(request,response){
    var nickname = request.body.nickname;
	var sql = 'SELECT nickname FROM message WHERE nickname=$1';
    var q = conn.query(sql,[nickname], function(error, result){
    	if(error){
    		console.log("Wrong sql!");
            response.render('room.html', {roomName: roomName, error_info:"Wrong SQL"});
    	}
    	else{
            if(q.rows.length>0){
                response.render('room.html', {roomName: roomName, error_info:"user name exist"});
            }
            else{
                
            }
    	}
    });

});
/*	var name = generateRoomIdentifier();
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
app.get('/:roomName', function(request,response){
	response.render('room.html', {roomName:request.params.roomName});
});
app.post('/:roomName', function(request,response){
	console.log("1:"+request.body.nickname);
});
app.get('/:roomName/messages',function(request,response){
	console.log("2:"+request.body.nickname);

});
app.post('/:roomName/messages',function(request,response){
	console.log("3:"+request.body.nickname);

});
var name="";
var nickname="";
app.get('/', function(request,response){
	response.render('index.html');
	name = generateRoomIdentifier();
	var sql = 'INSERT INTO room VALUES ($1, $2)';
	var q = conn.query(sql, [name, 0], function(error,result) {
		if(error){
			name = generateRoomIdentifier();
			console.log("hello!");
		}
    });
});
app.post('/', function(request,response){
	response.render('room.html', {roomName:name});
});
app.get('/:roomName', function(request,response){
	response.render('messages.html', {
		roomName:name,
		nickName:nickname;
	});
});
app.post('/:roomName', function(request,response){
	var sql = 'SELECT nickname FROM message WHERE nickname=$1';
    var q = conn.query(sql,[nickname], function(error, result){
    	if(error){
    		console.log("Nickname has already existed!");
    	}
    	else{
    	}
    });
});
*/
app.listen(8080);