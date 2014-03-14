CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roomname TEXT,
    nickname TEXT,
    body TEXT,
    time INTEGER,        
    FOREIGN KEY(roomname) REFERENCES room (name)
);
CREATE TABLE room (
	name TEXT PRIMARY KEY,
	numofPeople INTEGER
);