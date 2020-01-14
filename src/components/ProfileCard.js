import React from 'react';
import {Dimensions} from 'react-native';
import styled from 'styled-components';
import {useEnabledWidgets} from '../hooks/EnabledWidgetsContext';
import {useMyUser} from '../hooks/MyUserContext';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faRobot, faUserAstronaut, faAngleRight, faThumbsUp, faGrinTongue} from '@fortawesome/free-solid-svg-icons';

const StyledProfileCard = styled.View`
  position: absolute;
  top: 50%;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
`;

const Card = styled.View`
  background-color: rgba(0, 0, 0, 0.7);
  width: 95%;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 50px;
  border: 1px solid ${props => props.theme.colorPrimary};
  flex-direction: row;
  justify-content: center;
  position: relative;
  left: ${props => (props.active ? 0 : Dimensions.get('window').width)}px;
`;
const CardContent = styled.View`
  margin: 20px;
`;
const CardTitle = styled.View`
  flex-direction: row;
  align-content: center;
  margin: 5px auto;
`;
const PillContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
`;
const Pill = styled.View`
  background-color: ${props => props.theme.colorGreyDark1};
  border-radius: 5000px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 10px;
`;
const TitleText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 24px;
  margin: 0 10px;
`;
const PillText = styled.Text`
  color: ${props => props.theme.colorPrimary};
  font-size: 18px;
`;

export default function ProfileCard() {
  const {user} = useMyUser();

  const {enabledWidgets} = useEnabledWidgets();
  const active = enabledWidgets.profile;

  return (
    <StyledProfileCard>
      <Card active={active}>
        <CardContent>
          <CardTitle>
            <FontAwesomeIcon icon={faRobot} color="#fff" size={24} />
            <TitleText>They Are</TitleText>
            <FontAwesomeIcon icon={faUserAstronaut} color="#fff" size={24} />
          </CardTitle>
          <PillContainer>
            <Pill>
              <FontAwesomeIcon icon={faAngleRight} />
              <PillText>{user.gender}</PillText>
            </Pill>
            <Pill>
              <FontAwesomeIcon icon={faAngleRight} />
              <PillText>{user.age}</PillText>
            </Pill>
            <Pill>
              <FontAwesomeIcon icon={faAngleRight} />
              <PillText>{user.audioPref}</PillText>
            </Pill>
          </PillContainer>
          <CardTitle>
            <FontAwesomeIcon icon={faThumbsUp} color="#fff" size={24} />
            <TitleText>They Like</TitleText>
            <FontAwesomeIcon icon={faGrinTongue} color="#fff" size={24} />
          </CardTitle>
          <PillContainer>
            <Pill>
              <FontAwesomeIcon icon={faAngleRight} />
              <PillText>{user.lookingFor.map(x => x.name).join(', ')}</PillText>
            </Pill>
            <Pill>
              <FontAwesomeIcon icon={faAngleRight} />
              <PillText>{`${user.minAge}-${user.maxAge}`}</PillText>
            </Pill>
            <Pill>
              <FontAwesomeIcon icon={faAngleRight} />
              <PillText>{user.accAudioPrefs.map(x => x.name).join(', ')}</PillText>
            </Pill>
          </PillContainer>
        </CardContent>
      </Card>
    </StyledProfileCard>
  );
}
