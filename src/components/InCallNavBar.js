import React from 'react';
import styled from 'styled-components';
import ToggleButton from './ToggleButton';
import {useEnabledWidgets} from '../hooks/EnabledWidgetsContext';
import {useLocalStream} from '../hooks/LocalStreamContext';
import {useNotify} from '../hooks/NotifyContext';
import {useSocket} from '../hooks/SocketContext';
import {
  faStop,
  faMicrophone,
  faMicrophoneSlash,
  faVolumeMute,
  faVolumeUp,
  faCamera,
  faUserAlt,
  faStopwatch,
  faComment,
  faUserEdit,
  faChartArea,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import {faYoutube} from '@fortawesome/free-brands-svg-icons';

const StyledNavBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  font-size: 16px;
  margin-bottom: 5px;
`;
const LeftAligned = styled.View`
  flex-direction: row;
  flex: 1;
`;
const RightAligned = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 5px;
`;

export default function InCallNavBar(props) {
  const {resetState, buttons} = props;

  const {localStream} = useLocalStream();
  const {remoteStream} = useSocket();

  const {videoNotify, countdownNotify, textNotify} = useNotify();
  const {enabledWidgets, featureToggle, chatSettings, setChatSettings} = useEnabledWidgets();

  const flipCamera = async () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  // type should be speakerMute or micMute
  const handleMutePress = (stream, type) => {
    if (stream && stream.getAudioTracks()) {
      stream.getAudioTracks().forEach(track => {
        // enabled is the inverse of mute, but we're inverting that onPress
        track.enabled = chatSettings[type];
        console.log(`nav bar ${type}.enabled is now ${track.enabled}`);
      });
    }
    setChatSettings({...chatSettings, [type]: !chatSettings[type]});
  };

  return (
    <StyledNavBar>
      <LeftAligned>
        {buttons.stop && <ToggleButton iconClass={faStop} onPress={resetState} />}
        {buttons.mic && (
          <ToggleButton
            iconClass={chatSettings.micMute ? faMicrophoneSlash : faMicrophone}
            onPress={() => handleMutePress(localStream, 'micMute')}
            active={chatSettings.micMute ? 0 : 1}
          />
        )}
        {buttons.speaker && (
          <ToggleButton
            iconClass={chatSettings.speakerMute ? faVolumeMute : faVolumeUp}
            onPress={() => handleMutePress(remoteStream, 'speakerMute')}
            active={chatSettings.speakerMute ? 0 : 1}
          />
        )}
        <ToggleButton iconClass={faCamera} onPress={flipCamera} />
      </LeftAligned>
      <RightAligned>
        {buttons.profile && (
          <ToggleButton
            iconClass={faUserAlt}
            onPress={() => featureToggle('profile')}
            active={enabledWidgets.profile ? 1 : 0}
          />
        )}
        {buttons.countdown && (
          <ToggleButton
            iconClass={faStopwatch}
            onPress={() => featureToggle('countdown')}
            active={enabledWidgets.countdown ? 1 : 0}
            notification={countdownNotify ? 1 : 0}
          />
        )}
        {buttons.chat && (
          <ToggleButton
            iconClass={faComment}
            onPress={() => featureToggle('text')}
            active={enabledWidgets.text ? 1 : 0}
            notification={textNotify}
          />
        )}
        {buttons.video && (
          <ToggleButton
            iconClass={faYoutube}
            onPress={() => featureToggle('video')}
            active={enabledWidgets.video ? 1 : 0}
            notification={videoNotify ? 1 : 0}
          />
        )}
        {buttons.updatePref && (
          <ToggleButton
            iconClass={faUserEdit}
            onPress={() => featureToggle('updatePref')}
            active={enabledWidgets.updatePref ? 1 : 0}
          />
        )}
        {buttons.stats && (
          <ToggleButton
            iconClass={faChartArea}
            onPress={() => featureToggle('stats')}
            active={enabledWidgets.stats ? 1 : 0}
          />
        )}
        {buttons.matches && (
          <ToggleButton
            iconClass={faUsers}
            onPress={() => featureToggle('matches')}
            active={enabledWidgets.matches ? 1 : 0}
          />
        )}
      </RightAligned>
    </StyledNavBar>
  );
}
