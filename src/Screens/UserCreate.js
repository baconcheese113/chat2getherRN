import React from 'react';
import {Text} from 'react-native';
import {useApolloClient} from '@apollo/react-hooks';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheckSquare, faUsers} from '@fortawesome/free-solid-svg-icons';

import {CREATE_USER} from '../queries/mutations';
import UserCreateForm from '../components/UserCreateForm';

const Main = styled.ScrollView`
  width: 100%;
  height: 100%;
`;

const BackdropImage = styled.Image`
  position: absolute;
  /* filter: blur(3px) grayscale(0.9) brightness(50%); */
  /* transform: translate(-50%, -50%) scale(3); */
  /* object-position: center; */
  /* transform-origin: center center; */
  height: 100%;
  width: 100%;
  z-index: -1;
`;

const IntroSection = styled.View`
  flex-direction: column;
`;
const TitleFeature = styled.Text`
  font-size: 20px;
  margin: 20px auto;
  text-align: left;
  width: 70%;
  color: ${props => props.theme.colorPrimary || '#aaa'};
`;

const UserCreateStats = styled.View`
  /* display: inline-block; */
  width: 40%;
  /* margin: 2rem auto; */
`;

const UserCreateNumbers = styled.View`
  padding: 10px;
  min-width: 150px;
  justify-content: space-between;
  background-color: #555;
  border: 3px dashed #9932cc;
  border-radius: 20px;
`;

export default function UserCreate(props) {
  const {setUser} = props;
  // const [errorMsg, setErrorMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const client = useApolloClient();

  const handleSubmit = async ({gender, lookingFor, age, minAge, maxAge, audioPref, accAudioPrefs}) => {
    if (age && minAge && maxAge) {
      setIsSubmitting(true);
      const {data, loading, error} = await client.mutate({
        mutation: CREATE_USER,
        variables: {
          data: {
            gender,
            lookingFor: {connect: lookingFor},
            age,
            minAge,
            maxAge,
            audioPref,
            accAudioPrefs: {connect: accAudioPrefs},
          },
        },
      });
      if (error || loading) {
        // setErrorMsg(error || loading);
      } else {
        const user = data.createUser;
        user.lookingFor = lookingFor.map(x => {
          return {name: x};
        });
        user.accAudioPrefs = accAudioPrefs.map(x => {
          return {name: x};
        });
        setUser(user);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <Main>
      <IntroSection>
        <Text>
          Share video, audio or text*
          {'\n'}
          Chat together
        </Text>
        <TitleFeature {...props}>
          <FontAwesomeIcon icon={faCheckSquare} />
          <Text> 100% free</Text>
        </TitleFeature>
        <TitleFeature {...props}>
          <FontAwesomeIcon icon={faCheckSquare} />
          <Text> No account required</Text>
        </TitleFeature>
        <UserCreateStats>
          <UserCreateNumbers>
            <FontAwesomeIcon icon={faUsers} />
            <Text>2</Text>
          </UserCreateNumbers>
          <Text>Active users today</Text>
        </UserCreateStats>
      </IntroSection>

      <UserCreateForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />

      <Text>*You are paired strictly on your preferences and type of sharing (video, audio, text)</Text>
    </Main>
  );
}
