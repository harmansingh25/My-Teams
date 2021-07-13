
// Connecting to socket
const socket = io("/");


// Getting various elements from room view
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".cross");
const backBtn2 = document.querySelector(".cross2");
myVideo.muted = true;



// Initiate video Calling button




const beginCall = document.querySelector(".playVideo");



document.querySelector(".beforeVidIcon").classList.remove("beforeVidIcon");



// Getting the name from the URL


var url = window.location.href.split('?')[0];
document.querySelector(".inviteLink").innerHTML = url;


let user;
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

user = urlParams.get('name')

console.log(user);
appendPartic(user);




// Setting coontrol view of the video elements
myVideo.setAttribute('controls', 'controls');
const screenn = document.getElementById("shareButton");



//Array of connected peers
const peersDis={}

// Showing chat by clicking chat icon

showChat.addEventListener("click", () => {


  const rightMain = document.querySelector(".chatting");
  const leftMain = document.querySelector(".main__left");
  const partip = document.querySelector(".participants");
 

  // Dislaying Chat when the user clicks on chat icon

  console.log(rightMain.style.display);
  if(rightMain.style.display==="none"){

    if(partip.style.display!="none"){
      partip.style.display="none";
    }

    rightMain.style.display = "flex";
    rightMain.style.flex="0.2";
    leftMain.style.display = "flex";
    leftMain.style.flex = "0.75";
    
    // rightMain.style.display = "none";

  }

  else{

    rightMain.style.display = "flex";
    rightMain.style.flex="0";
    leftMain.style.display = "flex";
    leftMain.style.flex = "0.95";
  rightMain.style.display = "none";

  }


  
});






// Showing participants by clicking that icon



document.querySelector("#showPartic").addEventListener("click", () => {


  const rightMain = document.querySelector(".participants");
  const leftMain = document.querySelector(".main__left");
  const chatting= document.querySelector(".chatting");

  // Dislaying Chat when the user clicks on chat icon

  if(rightMain.style.display==="none"){

    if(chatting.style.display!="none"){
      chatting.style.display='none';
    }

    rightMain.style.display = "flex";
    rightMain.style.flex="0.2";
    leftMain.style.display = "flex";
    leftMain.style.flex = "0.75";
    
    // rightMain.style.display = "none";

  }

  else{

    rightMain.style.display = "flex";
    rightMain.style.flex="0";
    leftMain.style.display = "flex";
    leftMain.style.flex = "0.95";
  rightMain.style.display = "none";

  }


  
});


// Adding participants to the list



const peerPart=[];

// Getting stored messages of the room from the db
socket.on("stored-msgs",result =>{
  if(result.length){
    result.forEach(message=>{
      if(message.roomNo==ROOM_ID)
      appendMsg(message.name, message.msg, message.timeStamp);
    })


  }
});




// Hadnling cross button of meeting chat and participants list

backBtn.addEventListener("click", () => {

  console.log("hi");

  let rightMain;
  const option1 = document.querySelector(".chatting");
  const option2 = document.querySelector(".participants");

  if(option1.style.flex!="0"){
    rightMain = option1;
  }
  else{
    rightMain=option2;
  }

  console.log(rightMain);


  const leftMain = document.querySelector(".main__left");

  rightMain.style.display = "flex";
    rightMain.style.flex="0";
    leftMain.style.display = "flex";
    leftMain.style.flex = "0.95";
  rightMain.style.display = "none";

});







// Getting user name from URL parameters


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


beginCall.addEventListener("click", ()=>{


  document.querySelector(".leftNav").classList.remove("beforeVidLeftNav");
  document.querySelector(".main__left").classList.remove("beforeVidLeftNav");
  document.querySelector(".main__right").classList.remove("beforeVidRight");
  document.querySelector(".playVideo").classList.add("beforeVidIcon");
  document.querySelector(".beforeVidCross").classList.remove("beforeVidCross");
  // document.querySelector(".leftNav").classList.remove("beforeVideoLeftNav");


});
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    console.log("hi")
    ArrayOfMediaStreams.push(stream);
    
    addVideoStream(myVideo, stream);
    myVideo.classList.add(myId);

    peer.on("call", (call) => {
      call.answer(stream);
      currPeers2.push(call.peerConnection);
      const video = document.createElement("video");
      video.setAttribute('controls', 'controls');

      socket.emit("take-name", user, myId);
      


      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
        console.log("hi")
        if(!ArrayOfMediaStreams.includes(userVideoStream)){
        ArrayOfMediaStreams.push(userVideoStream);
        }

       
        
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
  socket.emit("join-room", ROOM_ID, id);


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
    console.log("hi")
    if(!ArrayOfMediaStreams.includes(userVideoStream)){
    ArrayOfMediaStreams.push(userVideoStream);
    }
  });

  socket.emit("take-name", user, myId);

  peersDis[userId] = call;

};






// Adding new users to the participants window

socket.on("partiName", (name, usersId)=>{
  if(!peerPart.includes(usersId)){
    appendPartic(name);
    peerPart.push(usersId);

  }
  
});

// Handling Screen Sharing


let screeens;
screenn.addEventListener("click", shareScreen);

function shareScreen(){


  if(screenn.style.backgroundColor==="brown"){


    screenn.style.backgroundColor="#33344A"

  let videoTrack = myVideoStream.getVideoTracks()[0];

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

    myVideo.remove(screeens);
    myVideo.srcObject=myVideoStream;
  
    myVideo.addEventListener("loadedmetadata", () => {
      myVideo.play();
      //videoGrid.append(video);
    });



  }




else{  
    screenn.style.backgroundColor="brown";
  navigator.mediaDevices.getDisplayMedia({cursor:true})
  .then(screenStream=>{ 

    screeens = screenStream;

    myVideo.remove(myVideoStream);
    myVideo.srcObject=screenStream;
  
    myVideo.addEventListener("loadedmetadata", () => {
      myVideo.play();
      //videoGrid.append(video);
    });
   
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

}
// else{
//   screenn.style.backgroundColor==="#33344A"

//   let videoTrack = myVideoStream.getVideoTracks()[0];

//     currPeers1.forEach((element) => {

//       let sender = element.getSenders().find(function(s){
//         return s.track.kind==videoTrack.kind;
//       });
//       sender.replaceTrack(videoTrack);
//     })

//     currPeers2.forEach((element) => {

//       let sender = element.getSenders().find(function(s){
//         return s.track.kind==videoTrack.kind;
//       });
//       sender.replaceTrack(videoTrack);
//     })

//     myVideo.remove(screeens);
//     myVideo.srcObject=myVideoStream;
  
//     myVideo.addEventListener("loadedmetadata", () => {
//       myVideo.play();
//       //videoGrid.append(video);
//     });







// Handling Ending Call



document.querySelector("#declineButton").addEventListener("click", ()=>{





  document.querySelector(".leftNav").classList.add("beforeVidLeftNav");
  document.querySelector(".main__left").classList.add("beforeVidLeftNav");
  document.querySelector(".main__right").classList.add("beforeVidRight");
  document.querySelector(".playVideo").classList.remove("beforeVidIcon");
  document.querySelector(".header__back").classList.add("beforeVidCross");
  
  myVideo.remove();
  const vids=document.getElementsByTagName("video");
  console.log(vids);
  vids.forEach(element=>{
    element.remove();
  })
  socket.emit("myDisconnect", myId);
  console.log(myId);



})

socket.on("handleDisconnect", (userId)=>{
  console.log(userId);
  if(peersDis[userId]) peersDis[userId].close();
  
  document.getElementsByClassName(userId)[0].remove();

})









// Handling filters

const blurFilter = document.querySelector(".blurs");

const sepiaFilter = document.querySelector(".sepias");

const grayscaleFilter = document.querySelector(".grayscales");

const invertsFilter = document.querySelector(".inverts");

const npFilter = document.querySelector(".nones");

blurFilter.addEventListener("click",()=>{

  myVideo.classList.forEach(element=>{
    if(element==="sepia" || element==="blur" || element==="none"|| element==="grayscale" || element==="invert"){
      myVideo.classList.remove(element);
    }
  })



  myVideo.classList.add("blur");
  socket.emit("filter-apply", myId, "blur");


});
sepiaFilter.addEventListener("click",()=>{

  myVideo.classList.forEach(element=>{
    if(element==="sepia" || element==="blur" || element==="none"|| element==="grayscale" || element==="invert"){
      myVideo.classList.remove(element);
    }
  })

  myVideo.classList.add("sepia");
  socket.emit("filter-apply", myId, "sepia");


});

grayscaleFilter.addEventListener("click",()=>{

  myVideo.classList.forEach(element=>{
    if(element==="sepia" || element==="blur" || element==="none"|| element==="grayscale" || element==="invert"){
      myVideo.classList.remove(element);
    }
  })

  myVideo.classList.add("grayscale");
  socket.emit("filter-apply", myId, "grayscale");


});

invertsFilter.addEventListener("click",()=>{

  myVideo.classList.forEach(element=>{
    if(element==="sepia" || element==="blur" || element==="none"|| element==="grayscale" || element==="invert"){
      myVideo.classList.remove(element);
    }
  })

  myVideo.classList.add("invert");
  socket.emit("filter-apply", myId, "invert");


});

npFilter.addEventListener("click",()=>{

  myVideo.classList.forEach(element=>{
    if(element==="sepia" || element==="blur" || element==="none"|| element==="grayscale" || element==="invert"){
      myVideo.classList.remove(element);
    }
  })
  myVideo.classList.add("none");
  socket.emit("filter-apply", myId, "none");
});





socket.on("apply-filter", (otherID, filter) =>{

  if(otherID!=myId){
    console.log(filter);
    
  const filterVideo = document.getElementsByClassName(otherID)[0];
  if(filter!=null){
  filterVideo.classList.forEach(element=>{
    if(element==="sepia" || element==="blur" || element==="none"|| element==="grayscale" || element==="invert"){
      filterVideo.classList.remove(element);
    }
  })
  filterVideo.classList.add(filter);
  
  }
}

})

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });

};




// Getting Time and Date for messages


var date=month=year=hour=minutes = new Date();

var dateVal, monthVal, yearVal, hourVal, minuteVal;






// Handling chat messages


let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {




    dateVal=date.getDate();
    monthVal=month.getMonth();
    yearVal = year.getFullYear();
    hourVal = hour.getHours();
    minuteVal = minutes.getMinutes();

    var full_date = dateVal.toString()+"/"+monthVal.toString()+"/"+yearVal.toString().slice(2,4);

    var fullTime = hourVal.toString()+":"+minuteVal.toString();

    var timeStamp = full_date+" "+fullTime;




console.log(text.value);
    socket.emit("message", text.value, user, ROOM_ID, timeStamp);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    dateVal=date.getDate();
    monthVal=month.getMonth();
    yearVal = year.getFullYear();
    hourVal = hour.getHours();
    minuteVal = minutes.getMinutes();

    var full_date = dateVal.toString()+"/"+monthVal.toString()+"/"+yearVal.toString().slice(2,4);

    var fullTime = hourVal.toString()+":"+minuteVal.toString();

    var timeStamp = full_date+" "+fullTime;


  console.log(user);


    socket.emit("message", text.value, user, ROOM_ID, timeStamp);
    text.value = "";
  }


});






socket.on("createMessage", (message, userName) => {

  console.log("listening", message);


  dateVal=date.getDate();
  monthVal=month.getMonth();
  yearVal = year.getFullYear();
  hourVal = hour.getHours();
  minuteVal = minutes.getMinutes();

  var full_date = dateVal.toString()+"/"+monthVal.toString()+"/"+yearVal.toString().slice(2,4);

  var fullTime = hourVal.toString()+":"+minuteVal.toString();

  var timeStamp = full_date+" "+fullTime;



  if(userName.localeCompare(user)!=0){



    messages.innerHTML =
    messages.innerHTML +
    `<div class="messageUser beforeVid2">
        <b> <span> ${
          userName
        }</span> <span class="timeStamp"> ${timeStamp} </span></b>
        <span>${message}</span>
    </div>`;

  }
  else{
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message beforeVid2">
        <b> <span> ${
          userName
        }</span> <span class="timeStamp"> ${timeStamp} </span></b>
        <span>${message}</span>
    </div>`;
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
   
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
 
    muteButton.innerHTML = html;
  }
});







stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
   
    stopVideo.innerHTML = html;
  }
});




// Handling invitation





document.querySelector(".invitefrnd").addEventListener("click", (e) => {
  

  const name = document.querySelector(".n_friend").value;
  const email = document.querySelector(".e_friend").value;
  const message = url;

  


  var temp={
    from_name:user,
    to_name:name,
    message:message,
    to_email:email,


  };

  emailjs.send('service_6hhp1yh', 'template_lika5vg',temp )
  .then(function(res){
    console.log("success",res.status);
  });


});





















// Handling Recording


var recorder = new MultiStreamRecorder(ArrayOfMediaStreams, options);


document.querySelector('.btn-record-webm').onclick = function() {

  const lists=document.querySelector('.btn-record-webm').classList;

  var flag = 0;

  lists.forEach(element => {

    if(element==="makeRed"){
      flag=1;
     
    }
    
  });

  console.log(document.querySelector(".btn-record-webm").style.color);

  if(flag!=1){
    var videoElements = document.getElementsByTagName("video");

    recorder.record();

    document.querySelector(".btn-record-webm").classList.add("makeRed");
  }

  

  else{

      recorder.stop(function(blob) {
    
  
    // or
    var blob = recorder.blob;
    // var blobURL = URL.createObjectURL(blob);
    saveAs(blob, "Video-Recording.webm");

    document.querySelector(".btn-record-webm").classList.remove("makeRed");

    
  });

  }
  
};



// Appending Messages to chat window



function appendMsg(userName,message,time){




  if(userName.localeCompare(user)!=0){

    
    

    messages.innerHTML =
    messages.innerHTML +
    `<div class="messageUser beforeVid2">
        <b> <span> ${
          userName
        }</span> <span class="timeStamp"> ${time} </span></b>
        <span>${message}</span>
    </div>`;

  }
  else{
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message beforeVid2">
        <b> <span> ${
          userName
        }</span> <span class="timeStamp"> ${time} </span></b>
        <span>${message}</span>
    </div>`;
      }


}


// Handling BackButton of participants window

backBtn2.addEventListener("click", () => {



  const rightMain = document.querySelector(".participants");
  const leftMain = document.querySelector(".main__left");

  rightMain.style.display = "flex";
    rightMain.style.flex="0";
    leftMain.style.display = "flex";
    leftMain.style.flex = "0.95";
  rightMain.style.display = "none";

});


function appendPartic(name){

  const partic = document.querySelector(".messages2");
    
  

  partic.innerHTML=partic.innerHTML+`<div class="parti">
  <br><b> <span> ${
    name
  }</span> </b> <br><br>
  
</div>`;

}