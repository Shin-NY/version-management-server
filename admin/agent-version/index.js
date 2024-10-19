import { logout, redirectIfLoggedOut } from '../utils.js';

const handleDownloadFiles = async (ev) => {
  ev.preventDefault();

  const checkedboxes = document.getElementsByClassName('filename_checkbox');
  const filenames = [...checkedboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  if (filenames.length === 0) {
    alert('다운로드할 파일 이름을 입력하세요.');
    return;
  }

  // Download할 수 있는 URL 지정
  const downloadUrl = `/agent-versions/lts/download?filenames=${encodeURIComponent(filenames.join(','))}`;
  window.location.href = downloadUrl; // Redirect to the download URL
};

const fetchVersionInfo = async () => {
  const tbody = document.getElementById('cur_version_info');
  if (!tbody) return;

  const res = await fetch('/agent-versions/lts').then((res) => res.json());
  if (!res?.ok) return;

  const {
    result: { version, fileInfos, createdAt },
  } = res;

  tbody.insertAdjacentHTML(
    'beforeend',
    `
          <tr onclick="toggleDescription('desc1')">
              <td>${version}</td>
              <td>${new Date(createdAt).toLocaleString('ko-KR')}</td>
            </tr>
            <tr id="desc1" style="display: none">
              <td colspan="2">
                Current release of the agent module.<br />
                <form id="download_form">
                  <h4 style="margin-bottom: 0">File list</h4>
                  ${fileInfos
                    .map(
                      (fileInfo) =>
                        `
                      <div style="margin-bottom:6px">
                        <div style="display:flex; gap:4px">
                          <input style="width:20px; margin:0" checked type="checkbox" class="filename_checkbox" value=${fileInfo.filename} />
                          <label for="filename_checkbox">${fileInfo.filename}</label>
                        </div>
                        <span>hash value: ${fileInfo.hash}</span>
                      </div>
                  `,
                    )
                    .join('')}
                  <button class="download-btn">Download Version ${version}</button>
                </form>
              </td>
            </tr>
        `,
  );

  const downloadForm = document.getElementById('download_form');
  downloadForm.onsubmit = handleDownloadFiles;
};

const main = async () => {
  const button = document.getElementById('logout_button');
  button.onclick = logout;

  await fetchVersionInfo();
};

redirectIfLoggedOut();
window.onload = main;
