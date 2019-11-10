import React from 'react';
import styled from 'styled-components';
import {Text} from 'react-native';

const StyledChoiceSlider = styled.View`
  border-radius: 5000px; /* Large number to ensure rounded ends */
  width: 100%;
  /* margin: 10px auto; */
  background-color: ${props => props.theme.colorGreyDark1};
  /* display: flex; */
  flex-direction: row;
  justify-content: space-around;
  position: relative;
  border: 2px solid ${props => props.theme.colorPrimary};
  /* font-size: ${props => props.fontSize || 'inherit'}; */
  /* cursor: pointer; */
`;

const Option = styled.TouchableOpacity`
  border: none;
  border-radius: 30px;
  /* width: 100%; */
  flex: 1;
  align-self: center;
  padding: ${({height}) => height || '10px'} 0;
  margin: 0;
  opacity: 0.8;
  z-index: 10;
  color: ${props => (props.active ? 'white' : props.theme.colorPrimaryLight)};

  /* &:active,
  &:focus {
    background-color: transparent;
  } */
`;

const Slider = styled.View`
  /* background-image: linear-gradient(
    to bottom right,
    ${props => props.theme.colorPrimary},
    ${props => props.theme.colorGreyDark1}
  ); */
  background-color: ${props => props.theme.colorPrimary};
  position: absolute;
  width: ${props => 100 / props.choices.length}%;
  top: 0;
  bottom: 0;
  left: ${props => (props.selected / props.choices.length) * 100}%;
  border-radius: 5000px;
  z-index: 1;
  /* transition: all 0.8s; */
`;

export default function ChoiceSlider(props) {
  const {cur, change, choices} = props;
  // props.choices is a list of strings to display as choices
  // props.cur is the selected element
  // props.change is how to change the cur selected element

  const renderOptions = () => {
    const options = [];
    for (const [index, choice] of choices.entries()) {
      options.push(
        <Option active={cur === index} onPress={() => change(index)} key={index}>
          <Text>{choice.replace(/_/g, ' ')}</Text>
        </Option>,
      );
    }
    return options;
  };
  return (
    <StyledChoiceSlider>
      {renderOptions()}
      <Slider choices={choices} selected={cur} />
    </StyledChoiceSlider>
  );
}
