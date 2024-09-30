import { logout, redirectIfLoggedOut } from '../../utils.js';

const fetchVersions = async () => {
  const list = document.getElementById('versions_list');
  if (!list) return;

  const urlParams = new URLSearchParams(window.location.search);
  const moduleId = urlParams.get('module_id');

  const { ok, result: versions } = await fetch(
    `/modules/${moduleId}/versions`,
  ).then((res) => res.json());
  if (!ok) return;

  versions.forEach(({ id, version, hash }) => {
    list.insertAdjacentHTML(
      'beforeend',
      `
        <li>
          <h3>${version}</h3>
          <h3>${hash}</h3>
          <a href="/modules/versions/${id}" download>모듈 다운로드</a>
        </li>
      `,
    );
  });
};

const handleCreateVersion = async (ev) => {
  ev.preventDefault();
  const version = document.getElementById('version').value;
  const hash = document.getElementById('hash').value;
  const file = document.getElementById('file').files[0];

  const urlParams = new URLSearchParams(window.location.search);
  const moduleId = urlParams.get('module_id');

  const formData = new FormData();
  formData.append('version', version);
  formData.append('hash', hash);
  formData.append('file', file);

  await fetch(`/modules/${moduleId}/versions`, {
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

  await fetchVersions();
};

redirectIfLoggedOut();
window.onload = main;
