import React from 'react';
import {RTCView} from 'react-native-webrtc';
import styled from 'styled-components';
import Draggable from 'react-native-draggable';
import {useEnabledWidgets} from '../hooks/EnabledWidgetsContext';

const LocalVideoContainer = styled.View`
  background-color: #333;
  overflow: hidden;
  box-shadow: 0 0 2px #949494;
  opacity: 0.9;
  border-radius: 20px;
  border: 2px solid #555;
`;
const RemoteVideoContainer = styled.View`
  flex: 1;
`;

export default function VideoWindow(props) {
  const {stream, videoType} = props;

  const {chatSettings} = useEnabledWidgets();

  const getVideo = () => {
    const remoteWidth = videoType === 'remoteVideo' ? '100%' : 110;
    const remoteHeight = videoType === 'remoteVideo' ? '100%' : 160;
    if (stream) {
      return (
        <RTCView
          style={{height: remoteHeight, width: remoteWidth}}
          muted={videoType === 'localVideo' || chatSettings.speakerMute}
          streamURL={stream.toURL()}
        />
      );
    }
    return '';
  };

  if (videoType === 'localVideo') {
    return (
      <Draggable x={30} y={80} minX={0} minY={20} maxX={300} maxY={500} animatedViewProps={{zIndex: 0}}>
        <LocalVideoContainer>{getVideo()}</LocalVideoContainer>
      </Draggable>
    );
  }
  return <RemoteVideoContainer pointerEvents="box-none">{getVideo()}</RemoteVideoContainer>;
}
