import React from 'react';
import styled, {ThemeContext} from 'styled-components';
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
import MultiSlider from '../helpers/multi-slider/MultiSlider'
import CustomLabel from '../helpers/multi-slider/CustomLabel';

const StyledNumberSlider = styled.View`
  width: 100%;
  /* margin: 30px auto 10px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export default function NumberSlider(props) {
  const {numbers, change} = props;
  const MIN_AGE = 18;
  const MAX_AGE = 90;

  const theme = React.useContext(ThemeContext)
  const [parentWidth, setParentWidth] = React.useState(280) // default slider width 

  const handleSliderChange = newValue => {
    change(newValue);
  };
  
  const handleLayout = l => {
    console.log(l.nativeEvent)
    setParentWidth(l.nativeEvent.layout.width)
  }

  return (
    <StyledNumberSlider onLayout={handleLayout}>
      <MultiSlider
        sliderLength={parentWidth * .9}
        values={numbers}
        onValuesChangeFinish={handleSliderChange}
        max={MAX_AGE}
        min={MIN_AGE}
        enabledTwo={numbers.length > 1}
        minMarkerOverlapDistance={2}
        customLabel={CustomLabel}
        snapped
        allowOverlap={false}
        step={1}
        selectedStyle={{ backgroundColor: theme.colorPrimary }}
        markerStyle={{ backgroundColor: theme.colorPrimaryLight }}
      />
    </StyledNumberSlider>
  );
}
