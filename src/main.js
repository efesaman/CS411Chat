import { db, currentUserPromise } from './auth.js';
import { arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const newChatForm = document.getElementById('new-chat-form')
const newChatReceiver = document.getElementById('new-chat-receiver')
const user = await currentUserPromise;

newChatForm.addEventListener('submit', async e => {
  e.preventDefault()
  const receiver = newChatReceiver.value
  const userEmail = user.email
  const messages = []
  const chat_id = "" + userEmail + receiver

  const newChatRef = doc(db, "chats", chat_id);
  await setDoc(newChatRef, {
    user1: userEmail,
    user2: receiver,
    messages: messages
  });

  const user1Ref = doc(db, "users", userEmail);
  await updateDoc(userRef, {
    chats: arrayUnion(chat_id)
  });

  const user2Ref = doc(db, "users", receiver);
  await updateDoc(userRef, {
    chats: arrayUnion(chat_id)
  });

  newChatReceiver.value = ''
})

async function viewChats() {
    const docRef = doc(db, "users", user.email);
    const docSnap = await getDoc(docRef);
    var userObj;
    if (docSnap.exists()) {
      userObj = docSnap.data();
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
    var divider = document.getElementById("chats-list");

    for (var chat in userObj.chats) {
      var button = document.createElement("a");
    	button.href = "/chats/" + chat;
    	var buttonText = document.createElement("span");
    	buttonText.innerText = chat;
    	button.appendChild(buttonText);
    	divider.appendChild(button);
    }
}

viewChats()
