import React from 'react';
import { StackNavigator } from 'react-navigation';

import NewsFeedScreen from '../screens/NewsFeedScreen';
import NewsItemScreen from '../screens/NewsItemScreen';

const NewsFeedStackNavigator = StackNavigator(
  {
    MainNewsItem: {
      screen: NewsFeedScreen,
    },
    DetailNewsItem: {
      screen: NewsItemScreen,
    },
  },
  {
    navigationOptions: {
      headerMode: 'none',
    }
  }
);

export default class NewsFeedNavigator extends React.Component {
  render() {
    return <NewsFeedStackNavigator />
  }
}
