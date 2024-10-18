import { logout, redirectIfLoggedOut } from '../utils.js';

const fetchVersionInfo = async () => {
  const list = document.getElementById('cur_version_info');
  if (!list) return;

  const res = await fetch('/agent-versions/lts').then((res) => res.json());
  if (!res?.ok) return;

  const {
    result: { version, createdAt, files },
  } = res;

  // 파일 리스트를 추가적으로 반환하도록 수정했습니다.
  list.innerHTML = `
    <li>
      <h2>${version}</h2>
      <h4>파일 목록:</h4>
      <ul>
        ${files.map(file => `<li>${file}</li>`).join('')}
      </ul>
      <h4>파일 다운로드:</h4>
      <h4>${createdAt}</h4>
      <form id="download_form">
        <input type="text" id="file_names" placeholder="파일 이름을 입력하세요 (쉼표로 구분)" />
        <button type="submit">다운로드 선택한 파일</button>
      </form>
    </li>
  `;

  const downloadForm = document.getElementById('download_form');
  downloadForm.onsubmit = handleDownloadFiles;
};

const handleDownloadFiles = async (ev) => {
  ev.preventDefault();
  const inputField = document.getElementById('file_names');
  const fileNames = inputField.value.split(',').map(name => name.trim()).filter(name => name);

  if (fileNames.length === 0) {
    alert('다운로드할 파일 이름을 입력하세요.');
    return;
  }

  // Download할 수 있는 URL 지정
  const downloadUrl = `/agent-versions/lts/download?files=${encodeURIComponent(fileNames.join(','))}`;
  window.location.href = downloadUrl;  // Redirect to the download URL
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