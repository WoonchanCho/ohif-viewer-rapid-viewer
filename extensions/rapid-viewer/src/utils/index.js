const LOGIN_INFO = 'recentLogin';

export function getRecentLoginInfo() {
  try {
    const loginInfo = JSON.parse(window.localStorage.getItem(LOGIN_INFO));
    if (!loginInfo) {
      throw Error();
    }
    return {
      xnatUrl: loginInfo.xnatUrl,
      username: loginInfo.username,
    };
  } catch (error) {
    return {
      xnatUrl: undefined,
      username: undefined,
    };
  }
}

export function saveLoginInfo(xnatUrl, username) {
  const loginInfo = {
    xnatUrl,
    username,
  };
  window.localStorage.setItem(LOGIN_INFO, JSON.stringify(loginInfo));

  // Check if this is a Renderer process of Electron and if so, send IPC message to the main process
  if (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    window.process.type === 'renderer'
  ) {
    try {
      window.require('electron').ipcRenderer.send('save-login-info', loginInfo);
    } catch (error) {
      console.warn(
        'Failed to send save-xnat-url IPC message to the main process'
      );
      console.warn(error);
    }
  }
}
