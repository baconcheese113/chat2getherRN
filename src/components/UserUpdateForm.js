import React from 'react'
import styled from 'styled-components'
import { useApolloClient } from '@apollo/react-hooks'
import NumberSlider from './NumberSlider'
import { UPDATE_USER } from '../queries/mutations'
import ChoicePicker from './ChoicePicker'
import ChoiceSlider from './ChoiceSlider'
import { GENDERS, AUDIO_PREFS } from '../helpers/constants'

const StyledForm = styled.View`
  max-height: 55%;
  flex: 1;
`
const Row = styled.View`
  align-items: center;
`
const ScrollContent = styled.ScrollView``

const InputLabel = styled.Text`
  font-size: ${({ fontSize }) => fontSize || 15}px;
  margin-right: 10px;
  text-transform: uppercase;
  color: ${props => props.theme.colorPrimaryLight};
`
const SubmitButton = styled.Button`
  box-shadow: 0 0 10px ${props => props.theme.colorPrimaryLight};
  border-radius: 10px;
  color: #fff;
  padding: 5px 10px;
  font-size: 20px;
  letter-spacing: 15px;
  /* margin: 10px auto 0; */
  /* filter: grayscale(${props => (props.hasChanges ? 0 : 1)}); */
`

const stripArr = arr => {
  return arr.map(x => {
    return { name: x.name }
  })
}

export default function UserUpdateForm(props) {
  const { user, setUser } = props
  const [lookingFor, setLookingFor] = React.useState(
    stripArr(user.lookingFor) ||
      GENDERS.map(x => {
        return { name: x }
      }),
  )
  const [minAge, setMinAge] = React.useState(user.minAge || 18)
  const [maxAge, setMaxAge] = React.useState(user.maxAge || 90)
  const [audioPref, setAudioPref] = React.useState(AUDIO_PREFS.indexOf(user.audioPref) || 0)
  const [accAudioPrefs, setAccAudioPrefs] = React.useState(
    stripArr(user.accAudioPrefs) ||
      AUDIO_PREFS.map(x => {
        return { name: x }
      }),
  )
  const [error, setError] = React.useState(null)
  const [hasChanges, setHasChanges] = React.useState(false)

  const client = useApolloClient()

  const changeNumbers = newArr => {
    if (newArr.length === 2) {
      setMinAge(newArr[0])
      setMaxAge(newArr[1])
    }
  }

  const areEqualArr = (arr1, arr2) => {
    const temp1 = arr1.map(x => x.name)
    const temp2 = arr2.map(x => x.name)

    const inTemp2 = temp1.every(x => temp2.includes(x))
    const inTemp1 = temp2.every(x => temp1.includes(x))

    return inTemp1 && inTemp2
  }

  const handleSubmit = async e => {
    console.log(user.lookingFor, lookingFor)
    const changes = {}

    // If lookingFor is different, changes should include it
    if (!areEqualArr(user.lookingFor, lookingFor)) {
      changes.lookingFor = lookingFor
    }
    // If minAge is different, changes should include it
    if (user.minAge !== minAge) {
      changes.minAge = minAge
    }
    // If maxAge is different, changes should include it
    if (user.maxAge !== maxAge) {
      changes.maxAge = maxAge
    }
    // If audioPref is different, changes should include it
    if (AUDIO_PREFS.indexOf(user.audioPref) !== audioPref) {
      changes.audioPref = AUDIO_PREFS[audioPref]
    }
    // If accAudioPrefs is different, changes should include it
    if (!areEqualArr(user.accAudioPrefs, accAudioPrefs)) {
      changes.accAudioPrefs = accAudioPrefs
    }

    console.log(changes)
    // If changes is empty return
    if (Object.entries(changes).length === 0) return

    // setUser based off changes
    setUser({ ...user, ...changes })

    // Now change shape to fit update (if lookingFor was changed)
    if (user.lookingFor !== lookingFor) {
      changes.lookingFor = {
        set: stripArr(lookingFor),
      }
    }
    // Now change shape to fit update (if accAudioPrefs was changed)
    if (user.accAudioPrefs !== accAudioPrefs) {
      changes.accAudioPrefs = {
        set: stripArr(accAudioPrefs),
      }
    }

    // Send request
    const { data, newError } = await client.mutate({ mutation: UPDATE_USER, variables: { data: changes } })
    if (newError) {
      setError(newError)
    }
    console.log(data)
  }

  React.useEffect(() => {
    if (
      !areEqualArr(user.lookingFor, lookingFor) ||
      minAge !== user.minAge ||
      maxAge !== user.maxAge ||
      !areEqualArr(user.accAudioPrefs, accAudioPrefs) ||
      audioPref !== AUDIO_PREFS.indexOf(user.audioPref)
    ) {
      if (!hasChanges) setHasChanges(true)
    } else if (hasChanges) setHasChanges(false)
  }, [lookingFor, user, maxAge, minAge, audioPref, accAudioPrefs])

  return (
    <StyledForm>
      <ScrollContent>
        <Row>
          <InputLabel>I want to chat with</InputLabel>
          <ChoicePicker selected={lookingFor} change={setLookingFor} choices={GENDERS} height="15px" width="100%" />
        </Row>
        <Row>
          <InputLabel>Their Age</InputLabel>
          <NumberSlider numbers={[minAge, maxAge]} change={changeNumbers} showFill />
        </Row>
        <Row>
          <InputLabel>My Audio Preference</InputLabel>
          <ChoiceSlider
            cur={audioPref}
            change={setAudioPref}
            choices={AUDIO_PREFS}
            height="15px"
            width="100%"
            fontSize="12px"
          />
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
      </ScrollContent>
      {error}
      <SubmitButton title="Apply" onPress={handleSubmit} disabled={!hasChanges} hasChanges={hasChanges} />
    </StyledForm>
  )
}
