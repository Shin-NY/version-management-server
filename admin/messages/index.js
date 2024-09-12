const logout = () => {
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
  window.location.href = '/';
};

const handleSubmit = async (ev) => {
  ev.preventDefault();
  const title = document.getElementById('title').value;
  const message = document.getElementById('message').value;

  await fetch('/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, message }),
  });

  location.reload();
};

const fetchMessages = async () => {
  const list = document.getElementById('messages_list');
  if (list) {
    const messages = await fetch('/api/messages').then((res) => res.json());

    messages.forEach(({ title, message }) => {
      const li = document.createElement('li');
      const h2 = document.createElement('h2');
      h2.innerText = title;
      const h3 = document.createElement('h3');
      h3.innerText = message;
      li.appendChild(h2);
      li.appendChild(h3);
      list.appendChild(li);
    });
  }
};

const main = async () => {
  const button = document.getElementById('logout_button');
  button.onclick = logout;

  const form = document.getElementById('message_upload_form');
  form.onsubmit = handleSubmit;

  await fetchMessages();
};

if (!document.cookie) window.location.replace('/');
window.onload = main;
