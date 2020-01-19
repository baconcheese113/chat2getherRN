import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';
import {REACT_APP_SEARCH_DOMAIN} from 'react-native-dotenv';
// import SVGTester from './SVGTester';

const StyledVideoGrid = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  /* z-index: 100; */
  display: ${props => (props.isShown ? 'flex' : 'none')};
`;
const Backdrop = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
`;
const Modal = styled.View`
  position: absolute;
  top: 10%;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  /* overflow-y: hidden; */
  margin: 0 auto;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
`;
const CloseButton = styled.TouchableOpacity`
  position: absolute;
  background-color: #fff;
  padding: 12px;
  border-radius: 5000px;
  top: 2%;
  right: 5%;
`;
const CloseButtonText = styled.Text``;
const SearchContent = styled.View`
  height: 100%;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const SearchEmptyStateText = styled.Text`
  font-size: 20px;
`;
const ScrollList = styled.ScrollView`
  /* display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); */
  /* flex-wrap: wrap; */
  /* gap: 10px; */
  /* height: 93%; */
  /* background-color: aquamarine; */
  /* overflow-y: auto; */
`;
const Result = styled.TouchableOpacity`
  position: relative;
  max-height: 300px;
  height: 250px;
  width: 100%;
`;
const ResultTitle = styled.Text`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
`;
const ResultImage = styled.Image`
  height: 100%;
`;
const ResultDuration = styled.Text`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 8px;
`;

const SearchBarForm = styled.View`
  flex-direction: row;
  padding: 0;
  /* border-bottom: 1px solid #555; */
  border-bottom-width: 1px;
  border-bottom-color: #555;
`;

const SearchBar = styled.TextInput`
  background-color: #aaa;
  border-radius: 10px;
  width: 82%;
  margin-right: -5px;
  font-size: 16px;
  padding: 0 4px;
`;
const SubmitButton = styled.TouchableOpacity`
  padding: 3px 6px;
  width: 20%;
  background-color: #222;
`;
const SubmitButtonText = styled.Text`
  text-align: center;
  font-size: 18px;
  color: #fff;
`;

export default function VideoGrid(props) {
  const {videos, onSubmitSearch, isShown, setIsShown, selectVideo} = props;
  const [query, setQuery] = React.useState('');
  const [submittedQuery, setSubmittedQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClose = () => {
    setIsShown(false);
  };

  const handleSelectVideo = id => {
    selectVideo(id);
    setIsShown(false);
  };

  const handleSearchSubmit = async () => {
    console.log(`Looking for ${query}`);
    if (!query || query.length < 1 || query === submittedQuery) return;
    setSubmittedQuery(query);
    setIsLoading(true);
    try {
      await onSubmitSearch(query);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const getContent = () => {
    if (isLoading) {
      console.log('displayed');
      // const length = `${window.innerWidth / 3}px`;
      return <SearchContent>{/* <SVGTester height={length} width={length} /> */}</SearchContent>;
    }
    if (!videos.length && submittedQuery) {
      return (
        <SearchContent>
          <SearchEmptyStateText>No results found</SearchEmptyStateText>
        </SearchContent>
      );
    }
    if (videos.length) {
      return (
        <ScrollList>
          {videos.map(video => {
            return (
              <Result
                key={video.id}
                onPress={() => {
                  console.log('pressed', video);
                  handleSelectVideo(video.id);
                }}>
                <ResultImage source={{uri: video.img}} alt={video.title} resizeMode="cover" />
                <ResultTitle>{video.title}</ResultTitle>
                <ResultDuration>{video.duration}</ResultDuration>
              </Result>
            );
          })}
        </ScrollList>
      );
    }
    return (
      <SearchContent>
        <SearchEmptyStateText>Enter a search above to start!</SearchEmptyStateText>
      </SearchContent>
    );
  };

  return (
    // Quick fix for display: none not working with position absolute
    <StyledVideoGrid isShown={isShown}>
      <View style={{display: isShown ? 'flex' : 'none', width: '100%', height: '100%'}}>
        <Backdrop />
        <CloseButton onPress={handleClose}>
          <CloseButtonText>X</CloseButtonText>
        </CloseButton>
        <Modal>
          <SearchBarForm>
            <SearchBar
              placeholder={`Search ${REACT_APP_SEARCH_DOMAIN} by keyword, no URLs`}
              value={query}
              onChangeText={text => setQuery(text)}
            />
            <SubmitButton onPress={handleSearchSubmit}>
              <SubmitButtonText>Search</SubmitButtonText>
            </SubmitButton>
          </SearchBarForm>
          {getContent()}
        </Modal>
      </View>
    </StyledVideoGrid>
  );
}
