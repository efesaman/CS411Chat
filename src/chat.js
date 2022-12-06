import { db, currentUserPromise } from './auth.js'
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js"
const socket = io('http://localhost:3000/', { transports : ['websocket'] })
var user = await currentUserPromise

const userDocRef = doc(db, "users", user.email)
const userDocSnap = await getDoc(userDocRef)
var userObj
if (userDocSnap.exists()) {
  userObj = userDocSnap.data()
  console.log("Document data:", userDocSnap.data())
} else {
  console.log("No such document!")
}
var chat = userObj.chats[chatInd]
const chatDocRef = doc(db, "chats", chat)
const chatDocSnap = await getDoc(chatDocRef)
var chatObj
if (chatDocSnap.exists()) {
  chatObj = chatDocSnap.data()
  console.log("Document data:", chatDocSnap.data())
} else {
  console.log("No such document!")
}
document.getElementById("chat-h1").innerText = "Chat with " + (userObj.email === chatObj.user2 ? chatObj.user1 : chatObj.user2);

socket.emit("chat-connected", chatObj.id)

var divider = document.getElementById("messages-list")
const sendForm = document.getElementById("send-message-form")

async function viewMessages() {
  for (var msg in chatObj.messages) {
  	var msgText = document.createElement("p")
  	msgText.innerText = chatObj.messages[msg].sender + ": " + chatObj.messages[msg].content
  	divider.appendChild(msgText)
  }
}

async function sendMessage() {
  const msg = document.getElementById("message-input").value
  socket.emit("send-chat-message", user.email, chatObj.id, msg)
  document.getElementById("message-input").value = ""
}

sendForm.addEventListener('submit', async e => {
  e.preventDefault()
  await sendMessage()
})

window.onbeforeunload = function() {
  socket.emit("leave-chat", chatObj.id)
}

await viewMessages()

socket.on("chat-message", (messageObj) => {
  var msgText = document.createElement("p")
  msgText.innerText = messageObj.sender + ": " + messageObj.content
  divider.appendChild(msgText)
})
