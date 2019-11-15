import AsyncStorage from '@react-native-community/async-storage';
import setCookie from 'set-cookie-parser';

const COOKIES = 'cookies';
class AsyncCookie {
  async putTokenInStorage(cookiesString: string) {
    try {
      await AsyncStorage.setItem(COOKIES, cookiesString);
    } catch (e) {
      console.error(e);
    }
  }

  async getCookie(cookieName: string) {
    try {
      const cookiesString = await AsyncStorage.getItem(COOKIES);
      const splitCookieHeaders = setCookie.splitCookiesString(cookiesString);
      const cookies = setCookie.parse(splitCookieHeaders);
      return cookies[cookieName];
    } catch (e) {
      console.error(e);
    }
  }

  async clearCookies() {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error(e);
    }
  }
}

export default new AsyncCookie();
