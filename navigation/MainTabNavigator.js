import React from 'react'
import { Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TabNavigator, TabBarBottom } from 'react-navigation'

import Colors from '../constants/Colors'

// import MatchCenterScreen from '../screens/MatchCenterScreen'
import AccountScreen from '../screens/AccountScreen'
import NewsFeedScreen from '../screens/NewsFeedScreen'
// import LiveScreen from '../screens/LiveScreen'
import ResultsScreen from '../screens/ResultsScreen'
import NewsFeedNavigation from './NewsFeedNavigation'
import AccountNavigation from './AccountNavigation'
import ResultNavigation from './ResultNavigation'

export const Navigator = TabNavigator(
  {
    NewsFeed: {
      screen: NewsFeedNavigation,
    },
    Results: {
      screen: ResultNavigation,
    },
    Account: {
      screen: AccountNavigation,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerMode: 'none',
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state
        let iconName
        switch (routeName) {
          case 'Account':
            iconName = Platform.OS === 'ios'
              ? `ios-person${focused ? '' : '-outline'}`
              : 'md-person'
            break
          case 'Live':
            iconName = Platform.OS === 'ios'
              ? `ios-basketball${focused ? '' : '-outline'}`
              : 'md-basketball'
            break
          case 'NewsFeed':
            iconName = Platform.OS === 'ios'
              ? `ios-compass${focused ? '' : '-outline'}`
              : 'md-compass'
            break
          case 'MatchCenter':
            iconName = Platform.OS === 'ios'
              ? `ios-analytics${focused ? '' : '-outline'}`
              : 'md-analytics'
            break
          case 'Results':
            iconName = Platform.OS === 'ios'
              ? `ios-basketball${focused ? '' : '-outline'}`
              : 'md-basketball'
            break
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        )
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    initialRouteName: 'NewsFeed',
  }
)

export default class MainTabNavigator extends React.Component {
  render() {
    return <Navigator screenProps={{rootNavigator: this.props.navigation}} />
  }
}
