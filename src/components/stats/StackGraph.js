import React from 'react';
import {Dimensions} from 'react-native';
import {
  VictoryChart,
  VictoryStack,
  VictoryScatter,
  VictoryArea,
  VictoryTheme,
  VictoryLegend,
  VictoryAxis,
  VictoryLine,
} from 'victory-native';
import {GET_USERS} from '../../queries/queries';
import {useApolloClient} from '@apollo/react-hooks';
import {GENDER_COLORS} from '../../helpers/constants';

const labelColor = '#fff';

const initialCategoryData = {
  MALE: [
    {x: 120, y: 19},
    {x: 90, y: 16},
    {x: 60, y: 14},
    {x: 30, y: 15},
    {x: 0, y: 15},
  ],
  FEMALE: [
    {x: 120, y: 14},
    {x: 90, y: 3},
    {x: 60, y: 0},
    {x: 30, y: 7},
    {x: 0, y: 12},
  ],
  F2M: [
    {x: 120, y: 7},
    {x: 90, y: 6},
    {x: 60, y: 2},
    {x: 30, y: 14},
    {x: 0, y: 8},
  ],
  M2F: [
    {x: 120, y: 16},
    {x: 90, y: 13},
    {x: 60, y: 8},
    {x: 30, y: 9},
    {x: 0, y: 6},
  ],
};

export default function StackGraph() {
  const numIntervals = 12;
  const intervalRange = 60 * 24 * 1; // minutes

  const [categoryData, setCategoryData] = React.useState();
  const rawUsersList = React.useRef([]);

  const client = useApolloClient();

  React.useEffect(() => {
    // When we remount, refreshUsersList
    refreshUsersList();
  }, []);

  const refreshUsersList = async () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - intervalRange * numIntervals);
    const where = {where: {updatedAt_gt: d.toISOString()}};
    const {data} = await client.query({query: GET_USERS, variables: where});
    if (data && data.users) {
      rawUsersList.current = data.users;
      const rawCategoryData = calcCategoryData();
      const convertedData = convertToGraphData(rawCategoryData);
      setCategoryData(convertedData);
    }
  };

  const convertToGraphData = data => {
    const d = new Date();
    const timeInts = Array(numIntervals)
      .fill(d)
      .map((val, index) => new Date().setMinutes(d.getMinutes() - index * intervalRange));
    data['MALE'] = data['MALE'].map((val, index) => ({x: timeInts[index], y: val}));
    data['FEMALE'] = data['FEMALE'].map((val, index) => ({x: timeInts[index], y: val}));
    data['M2F'] = data['M2F'].map((val, index) => ({x: timeInts[index], y: val}));
    data['F2M'] = data['F2M'].map((val, index) => ({x: timeInts[index], y: val}));
    return data;
  };

  const calcCategoryData = () => {
    const d = new Date();
    // arr['gender'][1]
    const timeInts = Array(numIntervals + 1)
      .fill(0)
      .map((val, index) => new Date().setMinutes(d.getMinutes() - index * intervalRange));
    const genderArrs = {
      MALE: Array(numIntervals).fill(0),
      FEMALE: Array(numIntervals).fill(0),
      F2M: Array(numIntervals).fill(0),
      M2F: Array(numIntervals).fill(0),
    };
    // Go through each user, get their updatedAt and createdAt
    // go through time intervals, if interval is between updatedAt and createdAt add 1 to specific gender array
    for (const user of rawUsersList.current) {
      for (const [index, timeInt] of timeInts.entries()) {
        const userIsUpdatedBeforeNextTimeInt =
          index < numIntervals &&
          Date.parse(user.updatedAt) > timeInts[index + 1] &&
          Date.parse(user.createdAt) < timeInt;
        if (userIsUpdatedBeforeNextTimeInt) {
          genderArrs[user.gender][index] += 1;
        }
      }
    }
    return genderArrs;
  };

  return (
    <VictoryChart
      height={350}
      width={Dimensions.get('window').width}
      theme={VictoryTheme.material}
      minDomain={{y: 0}}
      scale={{x: 'time'}}
      style={{grid: {backgroundColor: 'white'}}}>
      <VictoryLegend
        x={40}
        y={20}
        centerTitle
        orientation="horizontal"
        gutter={30}
        data={[
          {name: 'Male', symbol: {fill: GENDER_COLORS.MALE}, labels: {fill: GENDER_COLORS.MALE}},
          {name: 'Female', symbol: {fill: GENDER_COLORS.FEMALE}, labels: {fill: GENDER_COLORS.FEMALE}},
          {name: 'F2M', symbol: {fill: GENDER_COLORS.F2M}, labels: {fill: GENDER_COLORS.F2M}},
          {name: 'M2F', symbol: {fill: GENDER_COLORS.M2F}, labels: {fill: GENDER_COLORS.M2F}},
        ]}
      />
      <VictoryAxis
        label="Time"
        crossAxis={false}
        fixLabelOverlap
        style={{axisLabel: {padding: 30, fill: labelColor}, tickLabels: {fill: labelColor}}}
      />
      <VictoryAxis dependentAxis orientation="right" style={{tickLabels: {fill: labelColor}}} />

      {/* <VictoryLine data={data[0]} style={{ data: {stroke: GENDER_COLORS.MALE}}} interpolation="monotoneX" />
      <VictoryLine data={data[1]} style={{ data: {stroke: GENDER_COLORS.FEMALE}}} interpolation="monotoneX" />
      <VictoryLine data={data[2]} style={{ data: {stroke: GENDER_COLORS.F2M}}} interpolation="monotoneX" />
      <VictoryLine data={data[3]} style={{ data: {stroke: GENDER_COLORS.M2F}}} interpolation="monotoneX" />
      <VictoryScatter style={{data: {fill: GENDER_COLORS.MALE, opacity: 0.3}}} size={7} data={data[0]} />
      <VictoryScatter style={{data: {fill: GENDER_COLORS.FEMALE, opacity: 0.3}}} size={7} data={data[1]} />
      <VictoryScatter style={{data: {fill: GENDER_COLORS.F2M, opacity: 0.3}}} size={7} data={data[2]} />
      <VictoryScatter style={{data: {fill: GENDER_COLORS.M2F, opacity: 0.3}}} size={7} data={data[3]} /> */}

      {categoryData && (
        <VictoryStack animate={{duration: 3000}}>
          <VictoryArea
            interpolation="monotoneX"
            style={{data: {fill: GENDER_COLORS.MALE, fillOpacity: 0.7, stroke: GENDER_COLORS.MALE, strokeWidth: 3}}}
            data={categoryData.MALE}
          />
          <VictoryArea
            interpolation="monotoneX"
            style={{data: {fill: GENDER_COLORS.FEMALE, fillOpacity: 0.7, stroke: GENDER_COLORS.FEMALE, strokeWidth: 3}}}
            data={categoryData.FEMALE}
          />
          <VictoryArea
            interpolation="monotoneX"
            style={{data: {fill: GENDER_COLORS.F2M, fillOpacity: 0.7, stroke: GENDER_COLORS.F2M, strokeWidth: 3}}}
            data={categoryData.F2M}
          />
          <VictoryArea
            interpolation="monotoneX"
            style={{data: {fill: GENDER_COLORS.M2F, fillOpacity: 0.7, stroke: GENDER_COLORS.M2F, strokeWidth: 3}}}
            data={categoryData.M2F}
          />
        </VictoryStack>
      )}
    </VictoryChart>
  );
}
