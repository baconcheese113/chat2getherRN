import React from 'react';
import styled from 'styled-components';
import {View, Animated} from 'react-native';

const AnimatedView = Animated.createAnimatedComponent(View)

const StyledChoiceSlider = styled.View`
  background-color: ${props => props.theme.colorGreyDark1};
  border-radius: 5000px; /* Large number to ensure rounded ends */
  border: 2px solid ${props => props.theme.colorPrimary};
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin: 10px auto;
`;
const Option = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  border-radius: 5000px;
  color: ${props => (props.active ? 'white' : props.theme.colorPrimaryLight)};
  flex: 1;
  padding: 10px 0px;
`;
const OptionText = styled.Text`
  color: #eee;
  font-size: 12px;
`

const Slider = styled(AnimatedView)`
  background-color: ${props => props.theme.colorPrimary};
  border-radius: 5000px;
  bottom: 0;
  position: absolute;
  top: 0;
  width: ${props => 100 / props.choices.length}%;
`;


export default function ChoiceSlider(props) {
  const {cur, change, choices} = props;
  // props.choices is a list of strings to display as choices
  // props.cur is the selected element
  // props.change is how to change the cur selected element
  const getLeft = (interpPos, to, from) => {
    const totalJump = (to - from) / choices.length
    const startingPos = from / choices.length
    return (startingPos + (totalJump * interpPos)) * 100
  }

  const prevSelected = React.useRef(cur)
  const animStart = React.useRef(getLeft(1, cur, cur))
  const slideValue = React.useRef(new Animated.Value(0)).current
  const anim = React.useRef()

  const leftToInterp = (left, to, from) => {
    const startAbsolute = getLeft(0, to, from)
    const endAbsolute = getLeft(1, to, from)
    const interp = (startAbsolute - left) / (endAbsolute - startAbsolute)
    // console.log(`${startAbsolute} to ${endAbsolute} puts us at ${interp}`)
    return interp
  }

  const hanldleOptionPress = (num) => {
    if(num === cur) return
    animStart.current = getLeft(slideValue._value, cur, prevSelected.current)
    prevSelected.current = cur
    change(num)
  }
  
  React.useEffect(() => {
    if(cur !== prevSelected.current) {
      if(anim.current) anim.current.stop()
      slideValue.setValue(leftToInterp(animStart.current, cur, prevSelected.current))
      // console.log(`Moving from ${animStart.current} to ${getLeft(1, cur, prevSelected.current)} and slideValue ${slideValue._value}`)
      anim.current = Animated.timing(slideValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      })
      anim.current.start()
    }
  }, [cur])
  return (
    <StyledChoiceSlider>
      <Slider choices={choices} selected={cur} style={{left: slideValue.interpolate({
        inputRange: [0, 1],
        outputRange: [`${animStart.current}%`, `${getLeft(1, cur, prevSelected.current)}%`],
      })}} />
      {choices.map((choice, index) => (
        <Option active={cur === index} onPress={() => hanldleOptionPress(index)} key={choice}>
          <OptionText>{choice.replace(/_/g, ' ')}</OptionText>
        </Option>
      ))}
    </StyledChoiceSlider>
  );
}
