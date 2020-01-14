import React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import VideoWindow from '../components/VideoWindow';
import TextChat from '../components/TextChat';
// import Settings from './Settings'
import InCallNavBar from '../components/InCallNavBar';
// import VideoPlayer from './VideoPlayer'
import UserUpdateForm from '../components/UserUpdateForm';
// import Countdown from './Countdown'
import ProfileCard from '../components/ProfileCard';
import MatchHistory from '../components/MatchHistory';
// import AirPlaneDing from '../assets/air-plane-ding.mp3'
import {useLocalStream} from '../hooks/LocalStreamContext';
import {useEnabledWidgets} from '../hooks/EnabledWidgetsContext';
import {useSocket} from '../hooks/SocketContext';
import {useMyUser} from '../hooks/MyUserContext';
import StackGraph from '../components/stats/StackGraph';

const StyledChatHub = styled.View`
  /* height: 100vh; // shitty, but temp fix for firefox */
  /* height: -webkit-fill-available; */
  /* display: flex; */
  flex: 1;
  flex-direction: ${props => props.flowDirection};
  justify-content: center;
  overflow: hidden;
`;
const NextMatchButton = styled.Button`
  color: ${props => (props.disabled ? '#aaa' : '#fff')};
`;
// const NextMatchSVG = styled.svg`
//   position: absolute;
//   top: 0;
//   left: 0;
//   z-index: -1;
//   transform: scale(1.01, 1.1);
// `;
// const NextMatchRect = styled.rect`
//   stroke-width: 4px;
//   stroke-opacity: 1;
//   stroke-dashoffset: ${props => (props.disabled ? 0 : 349)}px;
//   stroke-dasharray: 349px;
//   stroke: ${props => props.theme.colorPrimary};
//   transition: all ${props => (props.disabled ? 1.8 : 0.2)}s;
// `;
const ConnectingText = styled.Text`
  padding: 0 10px;
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

  const handleNextMatch = e => {
    e.stopPropagation();
    if (localStream && canNextMatch) nextMatch(localStream);
  };

  const getChatNav = () => {
    return (
      <View style={{position: 'absolute', right: 20, top: 20, flexDirection: 'row', alignItems: 'center'}}>
        <NextMatchButton onPress={handleNextMatch} disabled={!canNextMatch} title="Next Match">
          {/* <NextMatchSVG width="100%" height="100%" fill="transparent">
            <NextMatchRect disabled={!canNextMatch} height="100%" width="100%" rx="15px" />
          </NextMatchSVG> */}
        </NextMatchButton>
        <TouchableOpacity onPress={() => setEnabledWidgets({...enabledWidgets, menu: true})}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </TouchableOpacity>
      </View>
    );
  };

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
          {/* <VideoPlayer socketHelper={socketHelper} userId={user.id} roomId={roomId} /> */}
          <VideoWindow videoType="remoteVideo" stream={remoteStream} />
          <VideoWindow videoType="localVideo" stream={localStream} />
          {getChatNav()}
          <TextChat user={user} socketHelper={socketHelper} room={roomId} />
          <ProfileCard user={otherUser} />
          {/* <Countdown socketHelper={socketHelper} myUserId={user.id} roomId={roomId} /> */}
          <InCallNavBar
            resetState={resetSocket}
            buttons={{stop: true, mic: true, speaker: true, profile: true, countdown: false, chat: true, video: false}}
          />
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
        {getChatNav()}
        <ConnectingText style={{color: '#fff'}}>{connectionMsg}</ConnectingText>
        <VideoWindow videoType="localVideo" stream={localStream} />
        {/* {matchCountdown > 0 && <View className="countdown">{matchCountdown}</View>} */}
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
