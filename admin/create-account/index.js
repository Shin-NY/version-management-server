const main = () => {
  const form = document.getElementById('signup_form');
  if (!form) return;

  form.onsubmit = async (ev) => {
    ev.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
    if (res?.ok) {
      window.location.href = '/admin';
    } else {
      alert(res.error);
    }
  };
};

window.onload = main;
