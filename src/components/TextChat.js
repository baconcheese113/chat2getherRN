import React from 'react';
import {View, Dimensions} from 'react-native';
import styled from 'styled-components';
import {useEnabledWidgets} from '../hooks/EnabledWidgetsContext';
import {useNotify} from '../hooks/NotifyContext';

const StyledTextChat = styled.View`
  /* display: ${props => (props.active ? 'flex' : 'none')}; */
  position: absolute;
  background-color: transparent;
  bottom: 56px;
  left: 0;
  width: 100%;
`;

const TextHistory = styled.FlatList`
  font-size: 18px;
  background-color: #111;
  opacity: 0.6;
  margin: 0 auto 40px;
  max-height: 150px;
  width: 90%;
  padding: 10px;
  position: relative;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const LocalComment = styled.Text`
  padding: 6px;
  color: #fff;
  text-align: right;
  align-self: flex-end;
  max-width: 85%;
`;

const RemoteComment = styled.Text`
  padding: 2px;
  text-align: left;
  align-self: flex-start;
  max-width: 85%;
  color: #e7b6ff;
  text-shadow: 0 0 1px #000;
`;

const TextConsole = styled.View`
  width: 100%;
  background-color: #9932cc;
  padding: 3px 5px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  flex-direction: row;
  position: absolute;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;
`;
// z-index: 5;

const ConsoleInput = styled.TextInput`
  width: ${Dimensions.get('window').width - 80}px;
  background-color: #c38fdd;
  border: 3px solid #c38fdd;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 2px;
  font-size: 14px;
  font-family: inherit;
`;
const ConsoleButton = styled.TouchableOpacity`
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-left: -2px;
  background-color: #333;
`;
const SendText = styled.Text`
  font-size: 20px;
  color: #fff;
  padding: 5px 20px 5px 5px;
`;

export default function TextChat(props) {
  const {user, socketHelper, room} = props;

  const [comment, setComment] = React.useState('');
  const [textChat, setTextChat] = React.useState([]);
  const [lastReadMsg, setLastReadMsg] = React.useState(-1);

  const {setTextNotify} = useNotify();
  const {enabledWidgets} = useEnabledWidgets();

  const onComment = e => {
    setTextChat(prev => [{comment: e.text, userId: e.userId}, ...prev]);
  };

  React.useEffect(() => {
    socketHelper.socket.on('comment', onComment);
    return () => {
      socketHelper.socket.off('comment', onComment);
    };
  }, [socketHelper.socket]);

  React.useEffect(() => {
    if (enabledWidgets.text) {
      if (lastReadMsg < textChat.length - 1) {
        setLastReadMsg(textChat.length - 1);
        setTextNotify(0);
      }
    } else {
      setTextNotify(textChat.length - 1 - lastReadMsg);
    }
  }, [enabledWidgets.text, textChat, lastReadMsg]);

  const handleSubmit = () => {
    if (!socketHelper || !comment) {
      console.log(`No sockethelper! ${socketHelper} ${comment}`);
      return;
    }
    socketHelper.emit('send', {
      userId: user.id,
      text: comment,
      roomId: room,
    });

    setComment('');
  };

  return (
    // Quick fix for display: none not working with position absolute
    <View style={{display: enabledWidgets.text ? 'flex' : 'none'}} pointerEvents="box-none">
      <StyledTextChat active={enabledWidgets.text} pointerEvents="box-none">
        <TextHistory
          inverted
          data={textChat}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item}) => {
            const CommentType = item.userId === user.id ? LocalComment : RemoteComment;
            return <CommentType>{item.comment}</CommentType>;
          }}
        />
        <TextConsole pointerEvents="box-none">
          <ConsoleInput value={comment} onChangeText={text => setComment(text)} />
          <ConsoleButton onPress={handleSubmit}>
            <SendText>Send</SendText>
          </ConsoleButton>
        </TextConsole>
      </StyledTextChat>
    </View>
  );
}
