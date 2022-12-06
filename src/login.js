import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { auth } from './auth.js';

onAuthStateChanged(auth, (user) => {
	if (user != null) {
		goToMainTab();
	}
});

function register() {
  const userEmail = document.getElementById("register_email").value
  const userPassword = document.getElementById("register_password").value
  const userPasswordConfirm = document.getElementById("register_password_confirm").value

  if (userPassword == userPasswordConfirm) {
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {
			axios.post('/api/users/create', {
	        email: userEmail,
          chats: [],
	    });
      goToMainTab()
    })
  } else {
		window.alert("Passwords do not match!")
	}
}

function login() {
  const userEmail = document.getElementById("login_email").value
  const userPassword = document.getElementById("login_password").value

  signInWithEmailAndPassword(auth, userEmail, userPassword).then(() => {
    goToMainTab()
  }).catch((error) => {
  	const errorCode = error.code
    const errorMessage = error.message
	console.log(errorMessage)
	window.alert("Invalid email or password!")
  })
}

function goToRegister() {
	document.getElementById("login_div").style.display = "none";
	document.getElementById("register_div").style.display = "block";
}

function goToLogin() {
	document.getElementById("login_div").style.display = "block";
	document.getElementById("register_div").style.display = "none";
}

function goToMainTab() {
	location.href = '/main';
}

document.getElementById('register_btn').addEventListener('click', register, true);
document.getElementById('login_btn').addEventListener('click', login, true);
document.getElementById('go_to_register_btn').addEventListener('click', goToRegister, true);
document.getElementById('go_to_login_btn').addEventListener('click', goToLogin, true);
