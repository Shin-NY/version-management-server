import { logout, redirectIfLoggedOut } from '../utils.js';

const fetchModules = async () => {
  const list = document.getElementById('modules_list');
  if (!list) return;

  const modules = await fetch('/modules').then((res) => res.json());

  modules.forEach(({ name, id }) => {
    list.insertAdjacentHTML(
      'beforeend',
      `
        <li>
          <h2>${name}</h2>
          <a href="/admin/modules/detail?module_id=${id}">모듈 상세</a>
        </li>
      `,
    );
  });
};

const handleCreateModule = async (ev) => {
  ev.preventDefault();
  const name = document.getElementById('name').value;

  await fetch('/modules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  location.reload();
};

const main = async () => {
  const button = document.getElementById('logout_button');
  button.onclick = logout;

  const form = document.getElementById('create_module_form');
  form.onsubmit = handleCreateModule;

  await fetchModules();
};

redirectIfLoggedOut();
window.onload = main;
