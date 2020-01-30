import React from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const StyledToggleButton = styled.View`
  height: 44px;
  width: 44px;
  margin-left: 5px;
`;
const ButtonElem = styled.TouchableOpacity`
  flex: 1;
  border-radius: 44px;
  justify-content: center;
  align-items: center;
  background-color: ${({active, theme}) => (active ? theme.colorPrimary : theme.colorGreyDark2)};
`;

const Notification = styled.Text`
  color: #fff;
  position: absolute;
  text-align: center;
  top: 0;
  right: 0;
  background-color: red;
  font-size: 13px;
  border-radius: 20px;
  width: 20px;
  height: 20px;
`;

export default function ToggleButton(props) {
  const {title, iconClass, onPress, notification} = props;
  return (
    <>
      <StyledToggleButton {...props}>
        <ButtonElem onPress={onPress} title={title} {...props}>
          {iconClass && <FontAwesomeIcon size={26} icon={iconClass} color="#ddd" />}
        </ButtonElem>
        {notification > 0 && <Notification>{notification}</Notification>}
      </StyledToggleButton>
    </>
  );
}
