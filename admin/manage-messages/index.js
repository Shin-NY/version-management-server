import { logout, redirectIfLoggedOut } from '../utils.js';

const main = async () => {
  const button = document.getElementById('logout_button');
  button.onclick = logout;
};

redirectIfLoggedOut();
window.onload = main;
