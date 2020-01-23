import React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import styled from 'styled-components';
import {ExitPortal} from '@cala/react-portal';
import VideoWindow from '../components/VideoWindow';
import TextChat from '../components/TextChat';
// import Settings from './Settings'
import InCallNavBar from '../components/InCallNavBar';
import VideoPlayer from '../components/VideoPlayer';
import UserUpdateForm from '../components/UserUpdateForm';
// import Countdown from './Countdown'
import ProfileCard from '../components/ProfileCard';
import MatchHistory from '../components/MatchHistory';
import StackGraph from '../components/stats/StackGraph';
import ChatNav from '../components/ChatNav';
// import AirPlaneDing from '../assets/air-plane-ding.mp3'
import {useLocalStream} from '../hooks/LocalStreamContext';
import {useEnabledWidgets} from '../hooks/EnabledWidgetsContext';
import {useSocket} from '../hooks/SocketContext';
import {useMyUser} from '../hooks/MyUserContext';

const StyledChatHub = styled.View`
  flex: 1;
  flex-direction: ${props => props.flowDirection};
  justify-content: center;
`;
const ConnectingText = styled.Text`
  padding: 0 10px;
`;
const CountdownText = styled.Text`
  width: 100%;
`;
// When user presses Share Video, request camera
// When user presses Next Match, Initialize socket and Find Room
// When connection is established, alert user to countdown
// Start Call
// On connection end or Find Next -> Find Room()

export default function ChatHub() {
  const [flowDirection, setFlowDirection] = React.useState(window.innerWidth > window.innerHeight ? 'row' : 'column');

  const {user, updateUser} = useMyUser();
  const {localStream, requestCamera} = useLocalStream();
  const {enabledWidgets, setEnabledWidgets} = useEnabledWidgets();
  const {
    socketHelper,
    connectionMsg,
    remoteStream,
    nextMatch,
    canNextMatch,
    roomId,
    resetSocket,
    otherUser,
    matchCountdown,
  } = useSocket();

  // const updateFlowDirection = React.useCallback(() => {
  //   const direction = window.innerWidth > window.innerHeight ? 'row' : 'column';
  //   setFlowDirection(direction);
  // }, [window.innerHeight, window.innerHeight]);

  // const logWindowError = e => console.log(e);

  // React.useEffect(() => {
  //   window.addEventListener('resize', updateFlowDirection);
  //   window.addEventListener('error', logWindowError);
  //   return () => {
  //     window.removeEventListener('resize', updateFlowDirection);
  //     window.removeEventListener('error', logWindowError);
  //   };
  // }, []);

  // const onUnload = React.useCallback(
  //   e => {
  //     if (!otherUser) return null;
  //     e.returnValue = 'Are you sure you want to end your call?';
  //     return 'Are you sure you want to end your call?';
  //   },
  //   [otherUser],
  // );

  // React.useEffect(() => {
  //   window.addEventListener('beforeunload', onUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', onUnload);
  //   };
  // }, [onUnload]);

  const renderBackground = () => {
    if (remoteStream) {
      return (
        <View style={{backgroundColor: '#333', height: '100%'}}>
          <VideoPlayer socketHelper={socketHelper} userId={user.id} roomId={roomId} />
          <VideoWindow videoType="remoteVideo" stream={remoteStream} />
          <ProfileCard user={otherUser} />
          <TextChat user={user} socketHelper={socketHelper} room={roomId} />
          {/* <Countdown socketHelper={socketHelper} myUserId={user.id} roomId={roomId} /> */}
          <ChatNav />
          <InCallNavBar
            resetState={resetSocket}
            buttons={{stop: true, mic: true, speaker: true, profile: true, countdown: false, chat: true, video: true}}
          />
          <VideoWindow videoType="localVideo" stream={localStream} />
          <ExitPortal name="fullscreen" />
        </View>
      );
    }
    if (!localStream) {
      return (
        <View>
          <Button onPress={() => requestCamera()} title="Share Video to Begin" />
        </View>
      );
    }
    return (
      <View style={{backgroundColor: '#333', height: '100%', justifyContent: 'space-evenly', alignItems: 'center'}}>
        <ConnectingText style={{color: '#fff'}}>{connectionMsg}</ConnectingText>
        {matchCountdown > 0 && <CountdownText>{matchCountdown}</CountdownText>}
        {enabledWidgets.updatePref && (
          <UserUpdateForm
            user={user}
            setUser={newUser => {
              updateUser(newUser);
              if (roomId) nextMatch();
            }}
          />
        )}
        {enabledWidgets.stats && <StackGraph />}
        {enabledWidgets.matches && <MatchHistory users={user.visited} />}
        <ChatNav />
        <VideoWindow videoType="localVideo" stream={localStream} />
        <InCallNavBar
          resetState={resetSocket}
          buttons={{stop: true, mic: true, speaker: true, matches: true, stats: true, updatePref: true}}
        />
      </View>
    );
  };

  return (
    <StyledChatHub flowDirection={flowDirection}>
      {renderBackground()}
      {/* {enabledWidgets.menu && <Settings />} */}
    </StyledChatHub>
  );
}
