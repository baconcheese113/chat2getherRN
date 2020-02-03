import React from 'react';
import styled from 'styled-components';
import {Text} from 'react-native';

const StyledChoicePicker = styled.View`
  border-radius: 5000px; /* Large number to ensure rounded ends */
  width: 100%;
  margin: 10px auto;
  background-color: ${props => props.theme.colorGreyDark1};
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border: 2px solid ${props => props.theme.colorPrimary};
  overflow: hidden;
`;

const Option = styled.TouchableOpacity`
  align-items: center;
  flex: 1;
  height: 100%;
  padding: ${({height}) => height || '10px'} 0;
  opacity: 0.8;
  color: ${props => (props.active ? 'white' : props.theme.colorPrimaryLight)};
  ${props => (props.active ? `background-color: ${props.theme.colorPrimary};` : '')}
`;
const OptionText = styled.Text`
  color: #eee;
  font-size: 12px;
`

export default function ChoicePicker(props) {
  const {selected, change, choices} = props;
  // props.choices is a list of strings to display as choices
  // props.selected is a list of the selected choices
  // props.change is how to change the selected elements

  const handlePress = choice => {
    if (selected.find(obj => obj.name === choice)) {
      change(selected.filter(obj => obj.name !== choice));
    } else {
      change([...selected, {name: choice}]);
    }
  };

  return (
    <StyledChoicePicker>
        {choices.map((choice, index) => (
          <Option
            key={choice}
            optionStart={index === 0}
            optionEnd={index === choices.length - 1}
            active={selected.find(obj => obj.name === choice)}
            onPress={() => handlePress(choice)}>
            <OptionText>{choice.replace(/_/g, ' ')}</OptionText>
          </Option>
        ))}
    </StyledChoicePicker>
  );
};
