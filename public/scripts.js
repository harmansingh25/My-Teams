
//Getting buttons


const createRoomBtn = document.getElementById("createRoom");
const joinRoomBtn = document.getElementById("joinRoom");
const joinRoomBtn2 = document.querySelector(".joinbtn");

//Creating a new room for the user

createRoomBtn.addEventListener("click", ()=>{


  const name = document.querySelector(".nameIn").value;
  


  
  window.location.href = "/createRoom/"+name;
});

//Handling joining room through link
joinRoomBtn.addEventListener("click", ()=>{



  document.querySelector(".linkIn").removeAttribute('hidden');
  document.querySelector(".joinbtn").removeAttribute('hidden');
 
  


  
  
});


//Finally joining the room
joinRoomBtn2.addEventListener("click", ()=>{
  const link = document.querySelector(".linkIn").value;
  const name = document.querySelector(".nameIn").value;
  
  if(link!=""){
    window.location.href = link+"?name="+name;

    console.log(link);

  }

})

