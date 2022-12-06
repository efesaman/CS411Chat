import { db, currentUserPromise } from './auth.js'
import { arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js"
const socket = io('http://localhost:3000', { transports : ['websocket'] })

const newChatForm = document.getElementById('new-chat-form')
const newChatReceiver = document.getElementById('new-chat-receiver')
const user = await currentUserPromise

newChatForm.addEventListener('submit', async e => {
  e.preventDefault()
  axios.post('/api/chats/create', {
      receiverEmail: newChatReceiver.value,
      userEmail: user.email,
  })

  newChatReceiver.value = ''
  location.reload()
})

async function viewChats() {
    const docRef = doc(db, "users", user.email)
    const docSnap = await getDoc(docRef)
    var userObj
    if (docSnap.exists()) {
      userObj = docSnap.data()
      console.log("Document data:", docSnap.data())
    } else {
      console.log("No such document!")
    }
    var divider = document.getElementById("chats-list")

    for (var chat in userObj.chats) {
      var chatId = userObj.chats[chat]
      const chatDocRef = doc(db, "chats", chatId)
      const chatDocSnap = await getDoc(chatDocRef)
      var chatObj = chatDocSnap.data()
      var button = document.createElement("a")
    	button.href = "/" + chat
    	var buttonText = document.createElement("p")
      buttonText.innerText = "Continue your conversation with: "
    	buttonText.innerText += userObj.email === chatObj.user2 ? chatObj.user1 : chatObj.user2;
    	button.appendChild(buttonText)
    	divider.appendChild(button)
    }
}

viewChats()
