const main = () => {
  const form = document.getElementById('login_form');
  if (!form) return;

  form.onsubmit = async (ev) => {
    ev.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
    
    if (res?.ok) {
      localStorage.setItem('username', res.username);
      console.log('Username saved to localStorage:', localStorage.getItem('username'));
      setTimeout(() => {
        window.location.href = '/admin/agent-version';
      }, 100); 
    } else {
      alert(res.error);
    }
  };
};

window.onload = main;
