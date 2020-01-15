import React, {useState} from 'react';
import styled from 'styled-components';
import ChoiceSlider from './ChoiceSlider';
import NumberSlider from './NumberSlider';
import SVGTester from './SVGTester';
import ChoicePicker from './ChoicePicker';
import {GENDERS, AUDIO_PREFS} from '../helpers/constants';

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
const Modal = styled.View`
  position: absolute;
  top: 0;
  bottom: 0%;
  left: 0%;
  right: 0%;
  background-color: #111;
  opacity: 0.9;
  z-index: 500;

  /* & > * {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0%;
    transform: translateY(-50%);
  } */
`;

export default function UserCreateForm(props) {
  const {error, onSubmit} = props;
  const [gender, setGender] = useState(0);
  const [lookingFor, setLookingFor] = useState(
    GENDERS.map(x => {
      return {name: x};
    }),
  );
  const [age, setAge] = useState(30);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(90);
  const [audioPref, setAudioPref] = useState(0);
  const [accAudioPrefs, setAccAudioPrefs] = useState(
    AUDIO_PREFS.map(x => {
      return {name: x};
    }),
  );
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = e => {
    setIsLoading(true);
    onSubmit(e, {
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
      {isLoading && <Modal>{/* <SVGTester height="50vh" width="50vh" /> */}</Modal>}
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
    </StyledForm>
  );
}
