import { logout, redirectIfLoggedOut } from '../utils.js';

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

  await fetch('/api/java/ModuleHashGenerator', {
    method: 'POST'
  });

  window.location.href = '/admin/agent-version';
};

const main = async () => {
  const button = document.getElementById('logout_button');
  button.onclick = logout;

  const form = document.getElementById('create_version_form');
  form.onsubmit = handleCreateVersion;
};

redirectIfLoggedOut();
window.onload = main;
