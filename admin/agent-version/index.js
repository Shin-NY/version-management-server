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

const main = async () => {
  const button = document.getElementById('logout_button');
  button.onclick = logout;

  await fetchVersionInfo();
};

redirectIfLoggedOut();
window.onload = main;
