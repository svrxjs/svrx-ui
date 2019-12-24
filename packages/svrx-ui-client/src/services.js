import { fetch as fetchPolyfill } from 'whatwg-fetch';
import { message } from 'antd';

const fetch = async (url, options) => {
  try {
    const resp = await fetchPolyfill(url, options);
    const json = await resp.json();
    if (!json || json.code !== 200) {
      message.error(json.message || 'Request Failed!');
      return null;
    }
    return json.data;
  } catch (e) {
    message.error(e.message || 'Request Failed!');
    return null;
  }
};

export function getDirectory() {
  return fetch('/api/internal/directory/get');
}

export function getBuiltins() {
  return fetch('/api/builtin/list/get');
}

export function getPlugins() {
  return fetch('/api/plugin/list/get');
}

export function setBuiltins(data) {
  return fetch('/api/builtin/list/set', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}


export function setPlugins(data) {
  return fetch('/api/plugin/list/set', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
