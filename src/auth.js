import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyCqHP62mwMG8-yTS20IQ74UgvcPlERF66k",
  authDomain: "cs411chat.firebaseapp.com",
  projectId: "cs411chat",
  storageBucket: "cs411chat.appspot.com",
  messagingSenderId: "864238830495",
  appId: "1:864238830495:web:0d742a37fca7c2b72673aa"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

function getCurrentUser(auth) {
  return new Promise((resolve, reject) => {
     const unsubscribe = auth.onAuthStateChanged(user => {
        unsubscribe()
        resolve(user)
     }, reject)
  })
}
export const currentUserPromise = getCurrentUser(auth)
