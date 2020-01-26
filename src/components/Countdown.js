import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import {useEnabledWidgets} from '../hooks/EnabledWidgetsContext';
import {useNotify} from '../hooks/NotifyContext';

/*
  Button absolutely positioned on screen "Countdown"
  User 1 presses button, emits "requestedCountdown" and button style changes to "Cancel Countdown"
  User 2 sees "Accept Countdown", and presses.
  Emits "acceptedCountdown" and both user's start counting down.
    -- if either user cancels, emits "cancelledCountdown" and immediately stops local timers and resets
    -- if User 2 doesn't press accept, it hangs. User 1 can tap to cancel
*/
const StyledCountdown = styled.View`
  color: #aaa;
  background-color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  position: absolute;
  bottom: 20%;
  left: 10px;
  border-radius: 20px;
  /* max-width: 20%; */
`;
const TextContainer = styled.View`
  /* display: flex; */
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px;
  width: 150px;
  height: 50px;
  background-color: #1e1e23;
`;
const CountdownText = styled.Text`
  color: #ccc;
  text-align: center;
  font-size: ${props => props.fontSize};
  text-shadow: 0 0 4px transparent;
`;
const ButtonsContainer = styled.View`
  flex-direction: row;
  z-index: 2;
  flex: 1;
  border: 0;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colorPrimary};
`;
const ActionButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  border-radius: 0;
  padding: 4px;
  height: 44px;
`;
const ActionButtonText = styled.Text`
  font-size: 14px;
  color: #ccc;
  text-align: center;
`;

export default function Countdown(props) {
  const {userId, socketHelper, roomId} = props;
  const [isRequester, setIsRequester] = React.useState(false);
  const [status, setStatus] = React.useState('none');
  const [countdownText, setCountdownText] = React.useState('Countdown');

  const timer = React.useRef();

  const {setCountdownNotify} = useNotify();
  const {enabledWidgets} = useEnabledWidgets();
  const active = enabledWidgets.countdown;

  const spacing = 1.6; // parsedText ? (4 / countdownText) * 0.2 + 1 : 1

  const resetTimer = () => {
    setStatus('none');
    setIsRequester(false);
    setCountdownText('Countdown');
    if (timer.current) clearTimeout(timer.current);
  };

  const tickTimer = oldTime => {
    const time = oldTime - 1;
    timer.current = undefined;
    if (time < 1) {
      console.log(`${time} is the time but cleared`);
      setCountdownText('Go!');
      timer.current = setTimeout(() => resetTimer(), 3000);
    } else {
      console.log(`${time} is the time`);
      setCountdownText(time);
      timer.current = setTimeout(() => {
        tickTimer(time);
      }, spacing * 1000); // (4 / time) * 200 + 1000)
    }
  };
  const startCountdown = () => {
    // Taking advantage of closure
    const time = 10;
    console.log('timer started');
    // Start countdown in 1 second
    timer.current = setTimeout(() => {
      tickTimer(time);
    }, 1000);
  };

  // Cancel on button instead of title (Cancel, Request)
  // Timing has only one slight delay for "Started Countdown" message
  // clearTimeout Timer.currentis not a function
  // Show "Cancelled Countdown" for both users

  React.useEffect(() => {
    if (active) setCountdownNotify(false);
  });

  React.useEffect(() => {
    if (!socketHelper) return;

    socketHelper.socket.on('requestedCountdown', senderUserId => {
      console.log('requested countdown', senderUserId, active);
      if (!active) {
        setCountdownNotify(true);
      }
      if (userId !== senderUserId) {
        setStatus('requested');
        setCountdownText('Ready to Countdown?');
      }
    });
    socketHelper.socket.on('startedCountdown', senderUserId => {
      console.log('started countdown', senderUserId);
      if (!active) {
        setCountdownNotify(true);
      }
      if (userId !== senderUserId) {
        setStatus('started');
        setCountdownText('10');
        startCountdown();
      }
    });
    socketHelper.socket.on('cancelledCountdown', senderUserId => {
      console.log('cancelled countdown', senderUserId);
      setCountdownNotify(false);
      if (timer && timer.current) {
        clearTimeout(timer.current);
      }
      setStatus('cancelled');
      setCountdownText('Countdown Cancelled');
      timer.current = setTimeout(() => resetTimer(), 3000);
    });
    return () => {
      if (timer && timer.current) clearTimeout(timer.current);
      socketHelper.socket.off('requestedCountdown');
      socketHelper.socket.off('startedCountdown');
      socketHelper.socket.off('cancelledCountdown');
    };
  }, [socketHelper]);

  const msg = {
    roomId,
    userId,
  };

  const handleRequest = () => {
    msg.type = 'requestedCountdown';
    socketHelper.emit('countdown', msg);
    setStatus('requested');
    setCountdownText('Requesting Countdown');
    setIsRequester(true);
  };
  const handleStart = () => {
    msg.type = 'startedCountdown';
    socketHelper.emit('countdown', msg);
    setStatus('started');
    setCountdownText('10');
    startCountdown();
  };
  const handleCancel = () => {
    msg.type = 'cancelledCountdown';
    if (timer && timer.current) {
      clearTimeout(timer.current);
    }
    socketHelper.emit('countdown', msg);
    setStatus('cancelled');
    setCountdownText('Countdown Cancelled');
    timer.current = setTimeout(() => resetTimer(), 3000);
  };

  return (
    <StyledCountdown>
      <View style={{display: active ? 'flex' : 'none', width: '100%', height: '100%'}} pointerEvents="box-none">
        <TextContainer>
          <CountdownText fontSize={status === 'started' ? '45px' : '14px'} spacing={spacing}>
            {countdownText}
          </CountdownText>
        </TextContainer>
        <ButtonsContainer>
          {status === 'none' && (
            <ActionButton onPress={handleRequest}>
              <ActionButtonText>Request</ActionButtonText>
            </ActionButton>
          )}
          {status === 'requested' && !isRequester && (
            <ActionButton onPress={handleStart}>
              <ActionButtonText>Start</ActionButtonText>
            </ActionButton>
          )}
          {(status === 'started' || status === 'requested') && (
            <ActionButton spacing={spacing} onPress={handleCancel}>
              <ActionButtonText>Cancel</ActionButtonText>
            </ActionButton>
          )}
        </ButtonsContainer>
      </View>
    </StyledCountdown>
  );
}
