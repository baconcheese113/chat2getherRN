import React from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import {useEnabledWidgets} from '../hooks/EnabledWidgetsContext';
import {useLocalStream} from '../hooks/LocalStreamContext';
import {useSocket} from '../hooks/SocketContext';

const StyledChatNav = styled.View`
  position: absolute;
  right: 10px;
  top: 10px;
  flex-direction: row;
  align-items: center;
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
const NextMatchButton = styled.TouchableOpacity`
  box-shadow: 0 0 4px;
  border-width: 1px;
  border-color: ${props => props.theme.colorGreyDark1};
  background-color: ${props => props.theme.colorGreyDark2};
  padding: 10.5px;
  border-radius: 8px;
`;
const NextMatchText = styled.Text`
  color: ${props => (props.disabled ? '#aaa' : '#fff')};
`;
const SettingsButton = styled.TouchableOpacity`
  box-shadow: 0 0 4px;
  border-width: 1px;
  border-color: ${props => props.theme.colorGreyDark1};
  background-color: ${props => props.theme.colorGreyDark2};
  padding: 12px;
  border-radius: 8px;
`;

export default function ChatNav(props) {
  const {localStream} = useLocalStream();
  const {enabledWidgets, setEnabledWidgets} = useEnabledWidgets();
  const {nextMatch, canNextMatch} = useSocket();

  const handleNextMatch = e => {
    e.stopPropagation();
    if (localStream && canNextMatch) nextMatch(localStream);
  };

  return (
    <StyledChatNav>
      <NextMatchButton onPress={handleNextMatch} disabled={!canNextMatch}>
        {/* <NextMatchSVG width="100%" height="100%" fill="transparent">
            <NextMatchRect disabled={!canNextMatch} height="100%" width="100%" rx="15px" />
          </NextMatchSVG> */}
        <NextMatchText>Next Match</NextMatchText>
      </NextMatchButton>
      <SettingsButton onPress={() => setEnabledWidgets({...enabledWidgets, menu: true})}>
        <FontAwesomeIcon icon={faEllipsisV} color="#fff" />
      </SettingsButton>
    </StyledChatNav>
  );
}
