import { logout, redirectIfLoggedOut } from '../utils.js';

const fetchVersionInfo = async () => {
  const tbody = document.getElementById('cur_version_info');
  if (!tbody) return;

  const res = await fetch('/agent-versions/lts').then((res) => res.json());
  if (!res?.ok) return;

  const {
    result: { version, createdAt },
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
                <a
                  href="/agent-versions/lts/download"
                  class="download-btn"
                  >Download Version ${version}</a
                >
              </td>
            </tr>
        `,
  );
};

const main = async () => {
  const button = document.getElementById('logout_button');
  button.onclick = logout;

  await fetchVersionInfo();
};

redirectIfLoggedOut();
window.onload = main;
