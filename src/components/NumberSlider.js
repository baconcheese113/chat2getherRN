import React from 'react';
import styled from 'styled-components';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const StyledNumberSlider = styled.View`
  width: 100%;
  /* margin: 30px auto 10px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StyledSlider = styled(MultiSlider)`
  color: ${props => props.theme.colorPrimary};

  /* & .slider-label {
    font-size: 20px;
  } */
`;

export default function NumberSlider(props) {
  const {numbers, change} = props;
  const MIN_AGE = 18;
  const MAX_AGE = 90;

  const handleSliderChange = newValue => {
    change(newValue);
  };

  return (
    <StyledNumberSlider>
      <StyledSlider
        // classes={{valueLabel: 'slider-label'}}
        values={numbers}
        onValuesChangeFinish={handleSliderChange}
        // defaultValue={numbers}
        // valueLabelDisplay="on"
        valuePrefix={'Number'}
        aria-labelledby="range-slider"
        getAriaValueText={val => `${val} years`}
        max={MAX_AGE}
        min={MIN_AGE}
        enabledTwo={numbers.length > 1}
      />
    </StyledNumberSlider>
  );
}
