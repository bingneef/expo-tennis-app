import React from 'react'
import { View } from 'react-native'
import { StackNavigator, NavigationActions } from 'react-navigation'

import MainTabNavigator from './MainTabNavigator'
import RegisterScreen from '../screens/RegisterScreen'

import store from '../store'
import { rehydrate, navReducer } from '../actions'
import { connect } from 'react-redux'
import ErrorBoundary from '../components/ErrorBoundary'

export const RootStackNavigator = StackNavigator(
  {
    Register: {
      screen: RegisterScreen,
    },
    Main: {
      screen: MainTabNavigator,
    },
  },
  {
    headerMode: 'none',
  }
)

@connect(
  state => ({
    rehydrated: state.rehydrated
  }),
  {
    rehydrate,
  }
)
export default class RootNavigator extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount () {
    store.dispatch(rehydrate())
  }

  render() {
    // Wait for hydration
    if (!this.props.rehydrated) {
      return <View />
    }

    return (
      <ErrorBoundary>
        <RootStackNavigator style={{backgroundColor: 'white'}} />
      </ErrorBoundary>
    )
  }
}
