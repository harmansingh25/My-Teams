const socket = io("/");
const createRoomBtn = document.getElementById("createRoom");
console.log("hi");
createRoomBtn.addEventListener("click", ()=>{
  console.log("hi");
  // var xhttp = new XMLHttpRequest();
  // xhttp.open("GET", "/createRoom", true);
  // xhttp.send();
  window.location.href = "/createroom";
});


