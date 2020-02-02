import React from 'react';
import {useApolloClient} from '@apollo/react-hooks';
import styled from 'styled-components';

import {CREATE_USER} from '../queries/mutations';
import UserCreateForm from '../components/UserCreateForm';

const Main = styled.ScrollView`
  background-color: ${props => props.theme.colorGreyDark1 || '#333'};
  width: 100%;
  height: 100%;
`;
const Title = styled.Text`
  font-size: 32px;
  text-align: center;
  margin: 48px;
  color: ${props => props.theme.colorPrimary};
  opacity: 0.7;
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
      <Title>Chat2Gether</Title>
      <UserCreateForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </Main>
  );
}
