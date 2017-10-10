import React from 'react'
import { View } from 'react-native'
import { StackNavigator } from 'react-navigation'

import MainTabNavigator from './MainTabNavigator'

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
    },
  },
  {
    headerMode: 'none',
  }
)

export default class RootNavigator extends React.Component {
  render() {
    return (
      <RootStackNavigator style={{backgroundColor: 'white'}} />
    )
  }
}
