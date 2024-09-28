const logout = () => {
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
  window.location.href = '/admin';
};

const fetchModules = async () => {
  const list = document.getElementById('modules_list');
  if (!list) return;

  const modules = await fetch('/modules').then((res) => res.json());

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

const handleSubmit = async (ev) => {
  ev.preventDefault();
  const name = document.getElementById('name').value;
  const version = document.getElementById('version').value;
  const hash = document.getElementById('hash').value;

  await fetch('/modules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, version, hash }),
  });

  location.reload();
};

const main = async () => {
  const button = document.getElementById('logout_button');
  button.onclick = logout;

  const form = document.getElementById('module_upload_form');
  form.onsubmit = handleSubmit;

  await fetchModules();
};

if (!document.cookie) window.location.replace('/admin');
window.onload = main;
