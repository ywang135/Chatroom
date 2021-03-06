CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roomname TEXT,
    nickname TEXT,
    body TEXT,
    time INTEGER,        
    FOREIGN KEY(roomname) REFERENCES room (name)
    FOREIGN KEY(nickname) REFERENCES users (name)
);
CREATE TABLE room (
	name TEXT PRIMARY KEY,
	numofPeople INTEGER
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,
    roomname TEXT,
    FOREIGN KEY(roomname) REFERENCES room (name)
);