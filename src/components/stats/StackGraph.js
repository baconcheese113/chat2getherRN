import React from 'react';
import {View, Dimensions} from 'react-native';
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

const originalData = [
  [
    {x: 120, y: 19},
    {x: 90, y: 16},
    {x: 60, y: 14},
    {x: 30, y: 15},
    {x: 0, y: 15},
  ],
  [
    {x: 120, y: 14},
    {x: 90, y: 3},
    {x: 60, y: 0},
    {x: 30, y: 7},
    {x: 0, y: 12},
  ],
  [
    {x: 120, y: 7},
    {x: 90, y: 6},
    {x: 60, y: 2},
    {x: 30, y: 14},
    {x: 0, y: 8},
  ],
  [
    {x: 120, y: 16},
    {x: 90, y: 13},
    {x: 60, y: 8},
    {x: 30, y: 9},
    {x: 0, y: 6},
  ],
];

const style = {
  data: {fill: '#745377'},
  labels: {fill: '#9810f8'},
  parent: {border: '2px solid #3091f0'},
  axis: {stroke: '#fff'},
};

export default function StackGraph() {
  const [pulseLine, setPulseLine] = React.useState(0);
  const [data, setData] = React.useState(originalData);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setData(d => d.reverse());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <VictoryChart height={350} width={Dimensions.get('window').width} theme={VictoryTheme.material} minDomain={0} style={{grid: {backgroundColor: 'white'}}}>
        <VictoryLegend
          x={40}
          y={20}
          centerTitle
          orientation="horizontal"
          gutter={30}
          data={[
            {name: 'Male', symbol: {fill: 'blue'}, labels: {fill: 'blue'}},
            {name: 'Female', symbol: {fill: 'red'}, labels: {fill: 'red'}},
            {name: 'F2M', symbol: {fill: 'purple'}, labels: {fill: 'purple'}},
            {name: 'M2F', symbol: {fill: 'gold'}, labels: {fill: 'gold'}},
          ]}
        />
        <VictoryAxis invertAxis label="Minutes Ago" tickValues={[0, 30, 60, 90, 120]} crossAxis={false} style={{axisLabel: {padding: 30, fill: 'pink'}, tickLabels: {fill: 'pink'}}} />
        {/* Dependent axis for data set one */}
        <VictoryAxis dependentAxis orientation="right" style={{tickLabels: {fill: 'pink'}}} />

        {/* <VictoryLine data={data[0]} style={{ data: {stroke: 'blue'}}} interpolation="monotoneX" />
        <VictoryLine data={data[1]} style={{ data: {stroke: 'red'}}} interpolation="monotoneX" />
        <VictoryLine data={data[2]} style={{ data: {stroke: 'purple'}}} interpolation="monotoneX" />
        <VictoryLine data={data[3]} style={{ data: {stroke: 'gold'}}} interpolation="monotoneX" />
        <VictoryScatter style={{data: {fill: 'blue', opacity: 0.3}}} size={7} data={data[0]} />
        <VictoryScatter style={{data: {fill: 'red', opacity: 0.3}}} size={7} data={data[1]} />
        <VictoryScatter style={{data: {fill: 'purple', opacity: 0.3}}} size={7} data={data[2]} />
        <VictoryScatter style={{data: {fill: 'gold', opacity: 0.3}}} size={7} data={data[3]} /> */}

        <VictoryStack >
          <VictoryArea interpolation="monotoneX" style={{data: {fill: 'blue', fillOpacity: .7, stroke: 'blue', strokeWidth: 3}}} data={data[0]} />
          <VictoryArea interpolation="monotoneX" style={{data: {fill: 'red', fillOpacity: .7, stroke: 'red', strokeWidth: 3}}} data={data[1]} />
          <VictoryArea interpolation="monotoneX" style={{data: {fill: 'purple', fillOpacity: .7, stroke: 'purple', strokeWidth: 3}}} data={data[2]} />
          <VictoryArea interpolation="monotoneX" style={{data: {fill: 'gold', fillOpacity: .7, stroke: 'gold', strokeWidth: 3}}} data={data[3]} />
        </VictoryStack>

      </VictoryChart>
    </>
  );
}
