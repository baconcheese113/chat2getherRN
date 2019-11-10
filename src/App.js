import React from 'react';
import {Text} from 'react-native';
import UserCreate from './screens/UserCreate';
import asyncCookie from './helpers/asyncCookie';
import AsyncStorage from '@react-native-community/async-storage';
// import Header from './Header'
// import UserCreate from './UserCreate'
// import ChatHub from './ChatHub'

/**
 * App just handles passing to UserCreate, and passing to ChatHub
 * UserCreate handles registering User or logging in with existing token
 * ChatHub handles finding room, sharing audio/video, socket connectivity, settings
 * TextChat handles rendering chat and socket transmissions
 * VideoWindow handles rendering streams (local and remote)
 */

export default function App() {
  const [user, setUser] = React.useState();
  const [hasCookies, setHasCookies] = React.useState(false);

  const storeUser = newUser => {
    // console.log(newUser);
    setUser(newUser);
    hasCookieStored();
  };

  const hasCookieStored = React.useCallback(async () => {
    console.log('finding cookies');
    const cookies = await AsyncStorage.getItem('cookies');
    console.log(cookies);
    setHasCookies(!!cookies);
  }, [setHasCookies]);

  React.useEffect(() => {
    hasCookieStored();
    // console.log(cookies);
    // console.log(document.cookie.split(';').filter(item => item.trim().startsWith('token=')).length === 0);
  }, []);

  if (hasCookies) {
    console.info(`cookies is defined`);
    return <Text>We have a user</Text>;
  }
  return <UserCreate setUser={storeUser} />;
}
