import React from 'react';
import {View} from 'react-native';
import {RTCView} from 'react-native-webrtc';
import styled from 'styled-components';
import {useEnabledWidgets} from '../hooks/EnabledWidgetsContext';

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

const VideoContainer = styled.View`
  position: absolute;
  background-color: #333;
  overflow: hidden;
  top: 50;
  left: 0;
  box-shadow: 0 0 2px #949494;
  opacity: 0.9;
  border-radius: 20;
  border: 2px solid #555;
  z-index: 20;
`;

export default function VideoWindow(props) {
  const {stream, videoType} = props;

  const [top, setTop] = React.useState(100);
  const [left, setLeft] = React.useState(100);

  const videoRef = React.useRef(null);
  const containerRef = React.useRef(null);

  const {chatSettings} = useEnabledWidgets();

  // const handleDrag = e => {
  //   if (e.dataTransfer) {
  //     e.dataTransfer.dropEffect = 'none'
  //   }
  //   setTop(clamp(e.clientY - 75, 20, 640 - 300))
  //   setLeft(clamp(e.clientX - 50, 20, 360 - 150))
  // }

  // const onTouchMove = e => {
  //   handleDrag(e.touches[0])
  // }

  // React.useEffect(() => {
  //   containerRef.current.addEventListener('mousedown', e => {
  //     handleDrag(e)
  //     containerRef.current.parentElement.addEventListener('mousemove', handleDrag)
  //   })
  //   containerRef.current.parentElement.addEventListener('mouseup', () => {
  //     if (!containerRef.current) return
  //     containerRef.current.parentElement.removeEventListener('mousemove', handleDrag)
  //   })
  //   // trySetMediaStream()
  //   return () => {
  //     containerRef.current.parentElement.removeEventListener('mousemove', handleDrag)
  //   }
  // }, [])

  // React.useEffect(() => {
  //   if (stream && videoRef.current.srcObject !== stream) {
  //     videoRef.current.srcObject = stream;
  //   }
  // });

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
    return <VideoContainer style={{top, left}}>{getVideo()}</VideoContainer>;
  }
  return (
    <VideoContainer style={{top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#888'}}>
      {getVideo()}
    </VideoContainer>
  );
}
