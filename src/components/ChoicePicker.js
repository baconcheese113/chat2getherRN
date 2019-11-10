import React from 'react';
import styled from 'styled-components';
import {Text} from 'react-native';

const StyledChoicePicker = styled.View`
  border-radius: 5000px; /* Large number to ensure rounded ends */
  width: 100%;
  margin: 10px auto;
  /* outline: none; */
  background-color: ${props => props.theme.colorGreyDark1};
  /* display: flex; */
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  position: relative;
  border: 2px solid ${props => props.theme.colorPrimary};
  /* font-size: ${props => props.fontSize || '16px'}; */
  /* cursor: pointer; */
`;

const Option = styled.TouchableOpacity`
  border: none;
  border-radius: 0;
  /* ${props => (props.optionStart ? 'border-radius: 30 0 0 30;' : '')} */
  /* ${props => (props.optionEnd ? 'border-radius: 0 30 30 0;' : '')} */
  /* width: 100%; */
  flex: 1;
  height: 100%;
  padding: ${({height}) => height || '10px'} 0;
  margin: 0;
  opacity: 0.8;
  z-index: 10;
  color: ${props => (props.active ? 'white' : props.theme.colorPrimaryLight)};
  ${props => (props.active ? `background-color: ${props.theme.colorPrimary};` : '')} /* transition: all .6s; */
`;

const ChoicePicker = props => {
  const {selected, change, choices} = props;
  // props.choices is a list of strings to display as choices
  // props.selected is a list of the selected choices
  // props.change is how to change the selected elements

  const handlePress = (e, choice) => {
    e.preventDefault();
    if (selected.find(obj => obj.name === choice)) {
      change(selected.filter(obj => obj.name !== choice));
    } else {
      change([...selected, {name: choice}]);
    }
  };

  const renderOptions = () => {
    const options = [];
    for (const [index, choice] of choices.entries()) {
      options.push(
        <Option
          optionStart={index === 0}
          optionEnd={index === choices.length - 1}
          active={selected.find(obj => obj.name === choice)}
          onPress={e => handlePress(e, choice)}
          key={index}>
          <Text>{choice.replace(/_/g, ' ')}</Text>
        </Option>,
      );
    }
    return options;
  };

  return <StyledChoicePicker>{renderOptions()}</StyledChoicePicker>;
};

export default ChoicePicker;
