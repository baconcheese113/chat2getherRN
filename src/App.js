import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {useApolloClient} from '@apollo/react-hooks';
import {PortalProvider} from '@cala/react-portal';
import UserCreate from './screens/UserCreate';
import ChatHub from './screens/ChatHub';
import MyUserProvider from './hooks/MyUserContext';
import {EnabledWidgetsProvider} from './hooks/EnabledWidgetsContext';
import SocketProvider from './hooks/SocketContext';
import {LocalStreamProvider} from './hooks/LocalStreamContext';
import {GET_ME} from './queries/queries';
import {NotifyProvider} from './hooks/NotifyContext';

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

  const client = useApolloClient();

  const storeUser = newUser => {
    // console.log(newUser);
    setUser(newUser);
    hasCookieStored();
  };

  const hasCookieStored = React.useCallback(async () => {
    console.log('finding cookies');
    const cookies = await AsyncStorage.getItem('cookies');
    console.log(cookies);
    const {data} = await client.query({query: GET_ME});
    if (data.me) {
      setUser({...user, ...data.me});
    }

    setHasCookies(!!cookies);
  }, [setHasCookies]);

  React.useEffect(() => {
    hasCookieStored();
    // console.log(cookies);
    // console.log(document.cookie.split(';').filter(item => item.trim().startsWith('token=')).length === 0);
  }, []);

  if (hasCookies) {
    return (
      <MyUserProvider user={user}>
        <EnabledWidgetsProvider>
          <SocketProvider>
            <LocalStreamProvider>
              <NotifyProvider>
                <PortalProvider>
                  <ChatHub />
                </PortalProvider>
              </NotifyProvider>
            </LocalStreamProvider>
          </SocketProvider>
        </EnabledWidgetsProvider>
      </MyUserProvider>
    );
  }
  return <UserCreate setUser={storeUser} />;
}
