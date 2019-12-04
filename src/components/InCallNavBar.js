import React from 'react'
import {View, Text} from 'react-native'
import styled from 'styled-components'
import ToggleButton from './ToggleButton'
import { useEnabledWidgets } from '../hooks/EnabledWidgetsContext'
import { useLocalStream } from '../hooks/LocalStreamContext'
import { useNotify } from '../hooks/NotifyContext'
import {faStop, faMicrophone, faMicrophoneSlash, faVolumeMute, faVolumeUp, faCamera, faUserAlt, faStopwatch, faComment, faUserEdit, faChartArea, faUsers} from '@fortawesome/free-solid-svg-icons';

const StyledNavBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  font-size: 16px;
  padding: 5px;
`
const LeftAligned = styled.View`
  flex-direction: row;
  flex: 1;
`
const RightAligned = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 5px;
`

export default function InCallNavBar(props) {
  const { resetState, buttons } = props

  const { localStream, requestCamera } = useLocalStream()
  const { videoNotify, countdownNotify, textNotify } = useNotify()
  const { enabledWidgets, featureToggle, chatSettings, setChatSettings } = useEnabledWidgets()

  const flipCamera = async e => {
    // e.stopPropagation()
    // try {
    //   const allDevices = await navigator.mediaDevices.enumerateDevices()
    //   const rear = allDevices.find(d => d.kind === 'videoinput' && d.label.includes('back'))
    //   const front = allDevices.find(d => d.kind === 'videoinput' && d.label.includes('front'))
    //   const currentId = localStream.getVideoTracks()[0].getSettings().deviceId
    //   console.log(currentId, rear.deviceId, front.deviceId)
    //   if (rear && front) {
    //     const newDeviceId = currentId === rear.deviceId ? front.deviceId : rear.deviceId
    //     requestCamera(newDeviceId)
    //   }
    // } catch (err) {
    //   console.error(err)
    // }
  }
  // return <View><Text>Hello</Text></View>

  if (!enabledWidgets) return <View></View>

  return (
    <StyledNavBar>
      <LeftAligned>
        {buttons.stop && <ToggleButton iconClass={faStop} onPress={resetState} />}
        {/* {buttons.mic && (
          <ToggleButton
            iconClass={chatSettings.micMute ? faMicrophoneSlash : faMicrophone}
            onPress={() => {
              if (localStream) {
                const audio = localStream.getAudioTracks()
                if (audio.length > 0) {
                  // enabled is the inverse of mute, but we're inverting that onPress
                  audio[0].enabled = chatSettings.micMute
                  console.log(`nav bar mic.enabled is now ${audio[0].enabled}`)
                }
              }
              setChatSettings({ ...chatSettings, micMute: !chatSettings.micMute })
            }}
            active={chatSettings.micMute ? 0 : 1}
          />
        )} */}
        {buttons.speaker && (
          <ToggleButton
            iconClass={chatSettings.speakerMute ? faVolumeMute : faVolumeUp}
            onPress={() => setChatSettings({ ...chatSettings, speakerMute: !chatSettings.speakerMute })}
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
            iconClass="fab fa-youtube"
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
  )
}
