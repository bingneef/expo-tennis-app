import React from 'react';
import { StackNavigator } from 'react-navigation';

import ResultsScreen from '../screens/ResultsScreen';
import TournamentsScreen from '../screens/TournamentsScreen';

const ResultStackNavigator = StackNavigator(
  {
    Tournaments: {
      screen: TournamentsScreen,
    },
    Results: {
      screen: ResultsScreen,
    },
  },
  {
    navigationOptions: {
      headerMode: 'none',
    }
  }
);

export default class ResultNavigator extends React.Component {
  render() {
    return <ResultStackNavigator/>
  }
}
