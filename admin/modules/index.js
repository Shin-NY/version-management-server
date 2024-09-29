import { logout, redirectIfLoggedOut } from '../utils.js';

const fetchModules = async () => {
  const list = document.getElementById('modules_list');
  if (!list) return;

  const modules = await fetch('/modules').then((res) => res.json());

  modules.forEach(({ name, version, hash, id }) => {
    list.insertAdjacentHTML(
      'beforeend',
      `
        <li>
          <h2>${name}</h2>
          <h3>${version}</h3>
          <h3>${hash}</h3>
          <a href="/modules/${id}" download>모듈 다운로드</a>
        </li>
      `,
    );
  });
};

const handleSubmit = async (ev) => {
  ev.preventDefault();
  const name = document.getElementById('name').value;
  const version = document.getElementById('version').value;
  const hash = document.getElementById('hash').value;
  const module = document.getElementById('module').files[0];

  const formData = new FormData();
  formData.append('name', name);
  formData.append('version', version);
  formData.append('hash', hash);
  formData.append('module', module);

  await fetch('/modules', {
    method: 'POST',
    body: formData,
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

redirectIfLoggedOut();
window.onload = main;
