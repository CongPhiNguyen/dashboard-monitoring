import Cookies from "universal-cookie";
export const cookiesUtil = {
  set,
  get,
  remove,
  getCurrentUserInfo,
  setAccessToken,
  getAccessToken,
  setCurrentUserInfo,
};

const cookies = new Cookies();

function set(key, value) {
  cookies.set(key, value, { path: "/" });
}

function get(key) {
  let value = cookies.get(key);
  if (value) {
    return value;
  }
  return null;
}

function getCurrentUserInfo() {
  return get("_user");
}

function remove(key) {
  let value = cookies.get(key);
  if (value) {
    cookies.remove(key);
    return true;
  }
  return false;
}

function setAccessToken(value) {
  cookies.set("_jwt", value);
}

function getAccessToken() {
  return cookies.get("_jwt");
}

function setCurrentUserInfo(value) {
  cookies.set("_user", value);
}
