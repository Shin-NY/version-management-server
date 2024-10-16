export const logout = () => {
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
  window.location.href = '/admin';
};

export const redirectIfLoggedOut = () => {
  if (!document.cookie) window.location.replace('/admin');
};
