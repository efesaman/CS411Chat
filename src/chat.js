import { db, currentUserPromise } from './auth.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

async function viewMessages() {
    var user = await currentUserPromise;
    const docRef = doc(db, "chats", user.uid);
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
    	button.href = "/" + chat;
    	var buttonText = document.createElement("span");
    	buttonTex.innerText = chat;
    	button.appendChild(buttonText);
    	divider.appendChild(button);
    }
}

viewMessages()
