import React from 'react'
import {
  Image,
  StyleSheet,
  ActivityIndicator,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Button, List, ListItem } from 'react-native-elements'
import { NavigationActions } from 'react-navigation'
import ModalPicker from 'react-native-modal-selector'
import { SFText, Title, SubTitle } from '../components/StyledText'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Ionicons } from '@expo/vector-icons'

import { players } from '../constants/Data'
import { setSettings } from '../actions'

const list = [
  {
    key: 'favPlayer',
    title: 'Favorite player',
    icon: 'ios-heart-outline',
  },
  {
    key: 'notifications',
    title: 'Notifications',
    icon: 'ios-megaphone-outline',
  },
]

@graphql(gql`
  query {
    currentUser{
      givenName
      photoUrl
      notifications {
        pushToken
        newsAlerts
      }
    }
  }
`, {
  options: props => ({
    variables: { },
    fetchPolicy: 'cache-and-network',
  })
})
@connect(
  state => ({
    settings: state.settings
  }),
  {
    setSettings,
  }
)
export default class AccountScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.gotoSettingsItem = this.gotoSettingsItem.bind(this)
  }

  async logout () {
    await Expo.SecureStore.deleteItemAsync('UserStore.token')
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Register'})
      ]
    })

    this.props.screenProps.rootNavigator.dispatch(resetAction)
  }

  savePlayerToSettings (player) {
    const settings = {
      ...this.props.settings,
      player,
    }
    this.saveSettings(settings)
  }

  saveSettings (settings) {
    this.props.setSettings(settings)
  }

  gotoSettingsItem (key) {
    const actionToDispatch = NavigationActions.navigate({
      routeName: 'SettingsItem',
      params: {
        key
      }
    })
    this.props.navigation.dispatch(actionToDispatch)
  }

  render() {
    if (this.props.data.loading) {
      return (
        <View>
          <ActivityIndicator
            animating={ true }
            style={{height: 80}}
            size="large"
          />
        </View>
      )
    }

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainerStyle}>
        <View style={[styles.section, styles.sectionContainer]}>
          <SubTitle />
          <View style={styles.titleContainer}>
            <View>
              <Title>{this.props.data.currentUser.givenName}</Title>
              <SubTitle>ACCOUNT & APP SETTINGS</SubTitle>
            </View>
            <Image
              style={styles.avatar}
              source={{uri: this.props.data.currentUser.photoUrl}}/>
          </View>
        </View>
        <View style={[styles.section, styles.sectionContainer, {flex: 1}]}>
          <List style={{borderWidth: 0}}>
            {
              list.map((item, i) => (
                <TouchableOpacity
                  onPress={() => this.gotoSettingsItem(item.key)}
                  key={i}>
                  <ListItem
                    title={item.title}
                    titleStyle={styles.titleStyle}
                    rightIcon={<Ionicons name={item.icon} size={32} />}
                    style={styles.listItem} />
                </TouchableOpacity>
              ))
            }
          </List>
        </View>
        <View style={[styles.section, styles.sectionContainer]}>
          <Button
            buttonStyle={{backgroundColor: 'red'}}
            textStyle={{textAlign: 'center'}}
            containerViewStyle={{width: '100%', marginLeft: 0}}
            title={`Logout`}
            onPress={() => this.logout()} />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 24,
    flex: 1,
    display: 'flex',
  },
  contentContainerStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    borderWidth: 0,
  },
  section: {
    paddingTop: 0,
    paddingBottom: 24,
  },
  sectionContainer: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  listItem: {
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: -1,
    borderColor: '#d6d7da',
    display: 'flex',
    alignItems: 'center',
  },
  titleStyle: {
    fontFamily: 'sf-pro',
    fontSize: 18,
  },
})
