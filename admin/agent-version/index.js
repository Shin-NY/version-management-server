import { logout, redirectIfLoggedOut } from '../utils.js';

const fetchVersionInfo = async () => {
  const list = document.getElementById('cur_version_info');
  if (!list) return;

  const res = await fetch('/agent-versions/lts').then((res) => res.json());
  if (!res?.ok) return;

  const {
    result: { version, createdAt },
  } = res;

  list.insertAdjacentHTML(
    'beforeend',
    `
        <li>
          <h2>${version}</h2>
          <h4>${createdAt}</h4>
          <a href="/agent-versions/lts/download">에이전트 다운로드</a>
        </li>
      `,
  );
};

const handleCreateVersion = async (ev) => {
  ev.preventDefault();
  const version = document.getElementById('version').value;
  const files = document.getElementById('files').files;

  const formData = new FormData();
  formData.append('version', version);
  for (const file of files) formData.append('files', file);

  await fetch('/agent-versions', {
    method: 'POST',
    body: formData,
  });

  location.reload();
};

const main = async () => {
  const button = document.getElementById('logout_button');
  button.onclick = logout;

  const form = document.getElementById('create_version_form');
  form.onsubmit = handleCreateVersion;

  await fetchVersionInfo();
};

redirectIfLoggedOut();
window.onload = main;
