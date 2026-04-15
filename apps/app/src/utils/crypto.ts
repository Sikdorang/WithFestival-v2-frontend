import CryptoJS from 'crypto-js';
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

/**
 * JSON 객체를 암호화하여 문자열로 반환합니다.
 * @param {object} jsonObject - 암호화할 JSON 객체
 * @returns {string} 암호화된 문자열
 */
export const encryptJson = (jsonObject: object) => {
  if (!jsonObject) return null;
  const jsonString = JSON.stringify(jsonObject);
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
};

/**
 * 암호화된 문자열을 JSON 객체로 복호화합니다.
 * @param {string} encryptedString - 복호화할 암호문
 * @returns {object | null} 복호화된 JSON 객체 또는 오류 발생 시 null
 */
export const decryptJson = (encryptedString: string) => {
  if (!encryptedString) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedString, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    return null;
  }
};
