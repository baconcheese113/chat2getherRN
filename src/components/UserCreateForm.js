import React from 'react';
import styled from 'styled-components';
import ChoiceSlider from './ChoiceSlider';
import NumberSlider from './NumberSlider';
import SVGTester from './SVGTester';
import ChoicePicker from './ChoicePicker';
import {GENDERS, AUDIO_PREFS} from '../helpers/constants';
import {EntrancePortal} from '@cala/react-portal';

const StyledForm = styled.View`
  background-color: ${props => props.theme.colorGreyDark1 || '#333'};
  padding: 10px;
  /* margin: 2rem 1rem; */
`;
const Row = styled.View`
  /* flex-direction: column; */
  align-items: center;
`;
const InputLabel = styled.Text`
  /* display: inline-block; */
  font-size: ${({fontSize}) => fontSize || 15}px;
  /* margin-right: 1rem; */
  text-transform: uppercase;
  color: ${props => props.theme.colorPrimaryLight};
`;
const SubmitButton = styled.Button`
  /* background-image: linear-gradient(
    to bottom right,
    ${props => props.theme.colorPrimary},
    ${props => props.theme.colorGreyDark1}
  ); */
  box-shadow: 0 0 10px ${props => props.theme.colorPrimaryLight};
  border-radius: 10px;
  color: #fff;
  padding: 5px 10px;
  font-size: 20px;
  letter-spacing: 15px;
  /* margin-top: 1rem; */
`;

export default function UserCreateForm(props) {
  const {isSubmitting, onSubmit} = props;
  const [gender, setGender] = React.useState(0);
  const [lookingFor, setLookingFor] = React.useState(
    GENDERS.map(x => {
      return {name: x};
    }),
  );
  const [age, setAge] = React.useState(30);
  const [minAge, setMinAge] = React.useState(18);
  const [maxAge, setMaxAge] = React.useState(90);
  const [audioPref, setAudioPref] = React.useState(0);
  const [accAudioPrefs, setAccAudioPrefs] = React.useState(
    AUDIO_PREFS.map(x => {
      return {name: x};
    }),
  );

  const changeNumbers = newArr => {
    if (newArr.length < 1) {
      return;
    }
    if (newArr.length === 1) {
      setAge(newArr[0]);
    } else if (newArr.length === 2) {
      setMinAge(newArr[0]);
      setMaxAge(newArr[1]);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      gender: GENDERS[gender],
      lookingFor,
      age,
      minAge,
      maxAge,
      audioPref: AUDIO_PREFS[audioPref],
      accAudioPrefs,
    });
  };

  return (
    <StyledForm>
      <Row>
        <InputLabel>I&apos;m</InputLabel>
        <ChoiceSlider cur={gender} change={setGender} choices={GENDERS} height="15px" width="100%" />
      </Row>
      <Row>
        <InputLabel>I want to chat with</InputLabel>
        <ChoicePicker selected={lookingFor} change={setLookingFor} choices={GENDERS} height="15px" width="100%" />
      </Row>
      <Row>
        <InputLabel>My Age</InputLabel>
        <NumberSlider numbers={[age]} change={changeNumbers} />
      </Row>
      <Row>
        <InputLabel>Their age</InputLabel>
        <NumberSlider numbers={[minAge, maxAge]} change={changeNumbers} showFill />
      </Row>
      <Row>
        <InputLabel>My Audio Preference</InputLabel>
        <ChoiceSlider cur={audioPref} change={setAudioPref} choices={AUDIO_PREFS} height="15px" width="100%" />
      </Row>
      <Row>
        <InputLabel>Preferences I&apos;ll do</InputLabel>
        <ChoicePicker
          selected={accAudioPrefs}
          change={setAccAudioPrefs}
          choices={AUDIO_PREFS}
          height="15px"
          width="100%"
          fontSize="11px"
        />
      </Row>
      <SubmitButton title="Start" onPress={handleSubmit} />
      {isSubmitting && (
        <EntrancePortal name="loading">
          <SVGTester />
        </EntrancePortal>
      )}
    </StyledForm>
  );
}
