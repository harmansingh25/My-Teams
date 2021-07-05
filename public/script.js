const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
myVideo.muted = true;

myVideo.setAttribute('controls', 'controls');
const screenn = document.getElementById("shareButton");

backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
});

const user = prompt("Enter your name");

var peer = new Peer(undefined, {
 
  
})

var currPeers1 = [];
var currPeers2 = [];


let myId;
let peerId;
let peerId2;




//Recording testing





var options = {
  mimeType: 'video/webm'
}


var ArrayOfMediaStreams = [];

console.log("hi1");

let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    ArrayOfMediaStreams.push(stream);
    
    addVideoStream(myVideo, stream);
    

    peer.on("call", (call) => {
      call.answer(stream);
      currPeers2.push(call.peerConnection);
      const video = document.createElement("video");
      video.setAttribute('controls', 'controls');
      


      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
        ArrayOfMediaStreams.push(userVideoStream);

       
        
      });


      peerId = call.peer;

      video.classList.add(peerId);
 
     
    });

    socket.on("user-connected", (userId) => {
      peerId = userId;

      connectToNewUser(userId, stream);
    });
  });


  

peer.on("open", (id) => {
  myId = id;
  myVideo.classList.add(myId);
  socket.emit("join-room", ROOM_ID, id, user);

});



const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);

  currPeers1.push(call.peerConnection);
  const video = document.createElement("video");
  video.setAttribute('controls', 'controls');
  peerId2=userId;
  video.classList.add(peerId2);


  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);

    ArrayOfMediaStreams.push(userVideoStream);
  });


};





screenn.addEventListener("click", shareScreen);

function shareScreen(){
  navigator.mediaDevices.getDisplayMedia({cursor:true})
  .then(screenStream=>{
   
    let videoTrack = screenStream.getVideoTracks()[0];

    currPeers1.forEach((element) => {

      let sender = element.getSenders().find(function(s){
        return s.track.kind==videoTrack.kind;
      });
      sender.replaceTrack(videoTrack);
    })

    currPeers2.forEach((element) => {

      let sender = element.getSenders().find(function(s){
        return s.track.kind==videoTrack.kind;
      });
      sender.replaceTrack(videoTrack);
    })
    

  })
}


const filterSelect = document.querySelector('select#filter');

filterSelect.onchange = function() {
  myVideo.classList.add(filterSelect.value);

  var filterVal = filterSelect.value;
  
  socket.emit("filter-apply", myId, filterVal);

};

socket.on("apply-filter", (otherID, filter) =>{

  if(otherID!=myId){
    console.log(filter);
  const filterVideo = document.getElementsByClassName(otherID)[0];
  filterVideo.classList.add(filter);
  
  }

})

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });

};

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});



stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          userName === user ? "me" : userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
});


const gdmOptions = {
  video: {
    cursor: "always"
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100
  }
}




// for(var i =0;i <videoElements.length; i++){

  


//   console.log(typeof videoElements[i].srcVideo);

//   ArrayOfMediaStreams.push(videoElements[i].srcVideo);


// }



var recorder = new MultiStreamRecorder(ArrayOfMediaStreams, options);


document.getElementById('btn-record-webm').onclick = function() {

  // var videoElements = document.getElementsByTagName("video");

  // console.log(videoElements.length);



  


  recorder.record();
  
};

document.getElementById('btn-record-stop').onclick = function(){

  recorder.stop(function(blob) {
    
  
    // or
    var blob = recorder.blob;
    // var blobURL = URL.createObjectURL(blob);
    saveAs(blob, "haha.webm");

    console.log(blob);
  });

}
