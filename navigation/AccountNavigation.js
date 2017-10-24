import React from 'react';
import { StackNavigator } from 'react-navigation';

import AccountScreen from '../screens/AccountScreen';
import SettingsItemScreen from '../screens/SettingsItemScreen';

const AccountStackNavigator = StackNavigator(
  {
    Account: {
      screen: AccountScreen,
    },
    SettingsItem: {
      screen: SettingsItemScreen,
    },
  },
  {
    navigationOptions: {
      headerMode: 'none',
    }
  }
);

export default class AccountNavigator extends React.Component {
  render() {
    return <AccountStackNavigator />
  }
}
