import AsyncStorage from '@react-native-community/async-storage';
import setCookie from 'set-cookie-parser';

class AsyncCookie {
  async putTokenInStorage(cookiesString: string) {
    try {
      await AsyncStorage.setItem('cookies', cookiesString);
    } catch (e) {
      console.error(e);
    }
  }

  async getCookie(cookieName: string) {
    try {
      const cookiesString = await AsyncStorage.getItem('cookies');
      const splitCookieHeaders = setCookie.splitCookiesString(cookiesString);
      const cookies = setCookie.parse(splitCookieHeaders);
      return cookies[cookieName];
    } catch (e) {
      console.error(e);
    }
  }
}

export default new AsyncCookie();
