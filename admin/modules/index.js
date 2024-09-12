const logout = () => {
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
  window.location.href = '/';
};

const setLogoutButton = () => {
  const button = document.getElementById('logout_button');
  button.onclick = logout;
};

const fetchMessages = async () => {
  const list = document.getElementById('modules_list');
  if (!list) return;

  const modules = await fetch('/api/modules').then((res) => res.json());

  modules.forEach(({ name, version, hash }) => {
    const li = document.createElement('li');
    const h2 = document.createElement('h2');
    h2.innerText = name;
    const h3Version = document.createElement('h3');
    h3Version.innerText = version;
    const h3Hash = document.createElement('h3');
    h3Hash.innerText = hash;
    li.appendChild(h2);
    li.appendChild(h3Version);
    li.appendChild(h3Hash);
    list.appendChild(li);
  });
};

const main = async () => {
  setLogoutButton();
  await fetchMessages();
};

if (!document.cookie) window.location.replace('/');
window.onload = main;
