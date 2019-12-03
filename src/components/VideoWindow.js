import React from 'react';
import {View, PanResponder} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import styled from 'styled-components';
import Draggable from 'react-native-draggable'
import {useEnabledWidgets} from '../hooks/EnabledWidgetsContext';

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

const VideoContainer = styled.View`
  /* position: absolute; */
  background-color: #333;
  overflow: hidden;
  /* top: 50;
  left: 0; */
  box-shadow: 0 0 2px #949494;
  opacity: 0.9;
  border-radius: 20;
  border: 2px solid #555;
  /* z-index: 20; */
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
      <Draggable x={30} y={80} minX={0} minY={20} maxX={300} maxY={500}>
        <VideoContainer>
          {getVideo()}
        </VideoContainer>
      </Draggable>
    );
  }
  return (
    <VideoContainer style={{top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#888'}}>
      {getVideo()}
    </VideoContainer>
  );
}
