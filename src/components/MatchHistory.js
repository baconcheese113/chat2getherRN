import React from 'react';
import {Text, Button} from 'react-native';
import styled from 'styled-components';
import {faUserSecret, faUserNurse, faUserNinja, faUserAstronaut, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome/';

const StyledMatchHistory = styled.ScrollView`
  width: 100%;
  max-height: 400px;
`;
const MatchItem = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 6px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const Icon = styled(FontAwesomeIcon)`
  margin-left: 5px;
  font-size: 80px;
  color: rgba(256, 256, 256, 0.4);
`;
const PillContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const Pill = styled.View`
  color: ${props => props.theme.colorPrimary};
  background-color: ${props => props.theme.colorGreyDark1};
  border-radius: 5000px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 10px;
  font-size: 18px;
`;
const ActionButtons = styled.View`
  margin-right: 5px;
`;
const EmptyText = styled.Text`
  color: #fff;
`;
export default function MatchHistory(props) {
  const {users} = props;
  console.log(props);

  const getIcon = gender => {
    if (gender === 'MALE') return faUserSecret;
    if (gender === 'FEMALE') return faUserNurse;
    if (gender === 'M2F') return faUserNinja;
    return faUserAstronaut;
  };

  if (!users || !users.length) {
    return <EmptyText>No matches yet</EmptyText>;
  }
  return (
    <StyledMatchHistory>
      {users.map(u => (
        <MatchItem key={u.id}>
          <FontAwesomeIcon icon={getIcon(u.gender)} size={80} color="rgba(256, 256, 256, .4)" />
          <PillContainer>
            <Pill>
              <Icon icon={faAngleRight} />
              <Text>{u.gender}</Text>
            </Pill>
            <Pill>
              <FontAwesomeIcon icon={faAngleRight} />
              <Text>{u.age}</Text>
            </Pill>
          </PillContainer>
          <ActionButtons>
            <Button title="Message" disabled style={{marginBottom: 40}} />
            <Button title="Report" disabled />
          </ActionButtons>
        </MatchItem>
      ))}
    </StyledMatchHistory>
  );
}

MatchHistory.defaultProps = {
  users: [
    {
      id: 0,
      gender: 'M2F',
      age: 25,
    },
    {
      id: 1,
      gender: 'MALE',
      age: 32,
    },
    {
      id: 2,
      gender: 'F2M',
      age: 29,
    },
    {
      id: 3,
      gender: 'FEMALE',
      age: 42,
    },
    {
      id: 4,
      gender: 'MALE',
      age: 19,
    },
    {
      id: 5,
      gender: 'F2M',
      age: 34,
    },
  ],
};
