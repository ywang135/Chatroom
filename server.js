var express = require('express');
var app = express();
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://chatroom.db');
var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname+ "/views"); // tell Express where to find templates

app.use(express.static(__dirname));

app.use(express.bodyParser());

function generateRoomIdentifier() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var result = '';
    for (var i = 0; i < 6; i++)
    	result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}
app.get('/', function(request,response){
    var html = '<!DOCTYPE html>\n' +
                '<html>\n' + '<head>\n' + '<title>My Chatroom</title>\n'+
                '<link rel="stylesheet" type="text/css" href="http://localhost:8080/views/CSS/style.css">'+
                '</head>\n' +
                '<body>\n' +
                '<form method="POST" id="roombutton">\n' +
                '<div id="form">\n'+
    	        '<input type="submit" value="Create a new room!">\n' +
	            '</div></form>\n'+
                '<div id="active">Active Room</div>\n'+
                '<div id="list">';
	var sql = "SELECT DISTINCT roomname FROM messages WHERE time >= strftime('%s','now') - 300";
    var q = conn.query(sql);
    q.on('row', function(row){
        html += '<a href="/'+row.roomname+'">'+row.roomname+'</a><br>';
    });
    q.on('end', function(){
        html += '</div></body>\n' + '<html>\n';
        response.write(html);
    });
    
});
app.post('/',function(request,response){
    var name = generateRoomIdentifier();
    var sql = 'INSERT INTO room VALUES ($1, $2)';
    var q = conn.query(sql, [name, 0], function(error,result){
        if(error){
            name = generateRoomIdentifier();
        }
        else{
            response.render('room.html', {roomName: name, error_info: ""});
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
		  response.render('room.html', {roomName: name,error_info: ""});
	   }
	   else{
         // response.render('index.html', {error_info:"No room name, you can create a new room here!"});
           response.redirect('/');
       }
		
    });
});
app.post('/:roomName',function(request,response){
    var nickname = request.body.nickname;
    var roomName = request.params.roomName;
    var i = 0;
    var sql1 = 'SELECT name FROM users WHERE roomname=$1 AND name=$2';
    var q = conn.query(sql1, [roomName, nickname]).on('row', function(row){
        i++;
    });
    q.on('end', function(){
       if(i > 0){
            response.render('room.html', {roomName: roomName, error_info:"Nickname exist"});
       }
       else{
            var newsql = 'UPDATE room SET numofPeople=numofPeople+1 WHERE name = $1';
            var q1 = conn.query(newsql, [roomName]).on('error',console.error);
            var sql = 'INSERT INTO users(name, roomname) VALUES ($1, $2)';
            var q = conn.query(sql,[nickname, roomName]).on('error',console.error);
            response.render('message.html', {roomName: request.params.roomName, nickName: nickname});
       }
    });

});
app.post('/:roomName/messages',function(request,response){
	var name = request.params.roomName;   
   	var nickname = request.body.nickName; 
   	var message = request.body.message;
    var time = new Date();
    conn.query('INSERT INTO messages(roomname, nickname, body, time) VALUES ($1, $2, $3, $4)', [name, nickname, message, time]).on('error',console.error);	
    response.render('message.html', {roomName: request.params.roomName, nickName: nickname});
    
    
});
app.get('/:roomName/messages',function(request,response){
    var sql = 'SELECT id, nickname, body, time FROM messages WHERE roomname=$1';
    var name = request.params.roomName;
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
    });
    q.on('end', function(){
        response.json(messages);
    });
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
    });
    q.on('end', function(){
        response.json(messages);

    });
    /*var messages = [{nickname: 'Miley', body: 'It\'s our party we can do what we want'},{nickname: 'Miley', body: 'It\'s our party we can do what we want'}];
    response.json(messages);*/
});
app.listen(8080);