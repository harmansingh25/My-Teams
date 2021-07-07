

const express = require("express");
const app = express();
const server = require("http").Server(app);

const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
// const { PeerServer } = require("peer");
// const peerServer = PeerServer({ port: 8000, path: '/' });

// app.use("/peerjs", peerServer);
app.use(express.static(__dirname + '/public'));


app.get("/", (req, res) => {
  
  res.render("home");
  // res.redirect(`/${uuidv4()}`);
});

app.get("/createroom", (req, res) => {
  
 
  res.redirect(`${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
    socket.on("screenShare", (screenStream)=>{
      io.to(roomId).emit("addScreenStream",screenStream);

    });

    socket.on("filter-apply", (id, filter)=>{
      io.to(roomId).emit("apply-filter", id, filter);
      console.log(filter);
    })

  });
});

server.listen(process.env.PORT || 3030, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
