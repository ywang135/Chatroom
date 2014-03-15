Database:
1. For loading the database, you need to use commands:
cat schema.sql | sqlite3 chatroom.db


Basic Content:
1. '/'page: There are a "create new room" button, and list all active rooms.
2. '/:roomname': You can enter your nickname here.
3. '/:roomname/message': You are allowed to submit your messages, and all messages will be displayed below. What's more, I added a scrollbox below.


Design:
1. You cannot enter same nickname in same room, but are allowed to use same name in different room.
2. Check duplicate room name,if there exists, generate again.
3. Add a user table in schema.sql, so two users can enter the room simultaneously without using same nicknames.
4. Display active room from database, and database will always exist even the server is down.
 
 
