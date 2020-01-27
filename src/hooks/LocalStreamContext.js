import React from 'react';
import {mediaDevices} from 'react-native-webrtc';
import {useEnabledWidgets} from './EnabledWidgetsContext';
import {useSocket} from './SocketContext';

const LocalStreamContext = React.createContext({localStream: null, requestCamera: () => {}});
export function useLocalStream() {
  return React.useContext(LocalStreamContext);
}

export const LocalStreamProvider = props => {
  const {children} = props;
  const [localStream, setLocalStream] = React.useState(null);

  const {chatSettings} = useEnabledWidgets();
  const {remoteStream, socketHelper} = useSocket();

  React.useEffect(() => {
    console.log(`localStream changed to `, localStream);
  }, [localStream]);

  // InitializeSocket needs to be called first
  const requestCamera = async (videoSource = undefined, audioSource = undefined) => {
    console.log('request camera');
    const constraints = {
      video: {
        deviceId: videoSource ? {exact: videoSource} : undefined,
        aspectRatio: {min: 0.5, max: 2},
      },
      audio: {
        deviceId: audioSource ? {exact: audioSource} : undefined,
      },
    };
    console.log(constraints);
    // Get stream
    try {
      console.log(mediaDevices);
      // Have to stop tracks before switching on mobile
      // if (localStream) localStream.getTracks().forEach(track => track.stop());
      if (localStream) localStream.stop();

      console.log('tracks stopped');
      const stream = await mediaDevices.getUserMedia(constraints);
      // If we have an existing connection
      console.log(stream);
      if (remoteStream && videoSource) {
        socketHelper.replaceStream(stream);
      }
      setLocalStream(stream);
      stream.getAudioTracks().forEach(track => {
        track.enabled = !chatSettings.micMute;
        console.log(`audio enabled is now ${track.enabled}`);
      });
    } catch (e) {
      alert(
        "Video is required to use this app. On iOS only Safari can share video. Also make sure you're at 'https://'. If you're still receiving this error, please contact me.",
      );
      console.error(e);
    }
  };

  return <LocalStreamContext.Provider value={{localStream, requestCamera}}>{children}</LocalStreamContext.Provider>;
};
