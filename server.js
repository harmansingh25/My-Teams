


const mongoose = require('mongoose');
const express = require("express");
const app = express();
const server = require("http").Server(app);

const { v4: uuidv4 } = require("uuid");
const Msg = require('./models/messages');
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});

const mongodb = "mongodb+srv://barado:barado21@cluster0.imow6.mongodb.net/message-db?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGODB_URI || mongodb,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
  console.log("connected to DB");
})


var nameP;

app.use(express.static(__dirname + '/public'));


app.get("/", (req, res) => {
  
  res.render("home");
  // res.redirect(`/${uuidv4()}`);
});

app.get("/createRoom/:name", (req, res) => {
  
  nameP=req.params.name;
  res.redirect(`/${uuidv4()}?name=${nameP}`);
});

var roomIds;
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room, myName:nameP});
  roomIds = req.params.room;
});

io.on("connection", (socket) => {

  Msg.find().then((result)=>{
    socket.emit('stored-msgs',result)
  });

  socket.on("take-name", (name)=>{
    socket.emit("myName", name);
    nameP=name;
    
  })


 

  
  
 
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);

    socket.to(roomId).broadcast.emit("user-connected", userId);


    socket.on("message", (messages,names,roomid,timestamp) => {
      console.log(messages);
      const message = new Msg({msg:messages, name:names, roomNo:roomid, timeStamp:timestamp});
      message.save().then(()=>{
        io.emit("createMessage", messages, names);
      });
     

    });
    socket.on("screenShare", (screenStream)=>{
      io.to(roomId).emit("addScreenStream",screenStream);

    });

    socket.on("filter-apply", (id, filter)=>{
      io.to(roomId).emit("apply-filter", id, filter);
      console.log(filter);
    })

    socket.on("myDisconnect", userId =>{
      io.to(roomId).emit("handleDisconnect", userId);
    })

    socket.on("take-name", (name,id) =>{
      socket.to(roomId).broadcast.emit("partiName", name, id);
    })

   

  });
});

server.listen(process.env.PORT || 3030, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
