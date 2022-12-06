import { signOut } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { auth } from './auth.js';

function logout() {
  signOut(auth).then(() => {
    goToLogin();
  }).catch((error) => {
    window.alert('Log out unsuccessful.');
  });
}

function goToLogin() {
	location.href = '/';
}

document.getElementById('logout_button').addEventListener('click', logout, true);
