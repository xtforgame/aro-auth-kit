import { b64_sha512crypt } from 'sha512crypt-node';

export function sha512gen_salt() {
  const char_num = 16; // max length of salt for sha512
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < char_num; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export function crypt(plain_text, _salt) {
  if (!_salt) {
    return null;
  }
  let salt = _salt;
  const firstDollar = salt.indexOf('$');

  if (firstDollar >= 0) {
    const secondDollar = salt.indexOf('$', firstDollar + 1);
    const thirdDollar = salt.indexOf('$', secondDollar + 1);
    if (secondDollar >= 0 && thirdDollar >= 0) {
      salt = salt.substr(secondDollar + 1, thirdDollar - secondDollar - 1);
    } else {
      return null;
    }
  }
  try {
    return b64_sha512crypt(plain_text, salt);
  } catch (e) {
    console.log(e);
    return null;
  }
}
