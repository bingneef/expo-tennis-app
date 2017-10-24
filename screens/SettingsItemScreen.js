import React from 'react'
import {
  Image,
  StyleSheet,
  ActivityIndicator,
  View,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { NavigationActions } from 'react-navigation'
import { SettingsFavPlayer, SettingsNotifications } from '../components/settings'
import { SFText, Title, SubTitle } from '../components/StyledText'
import { connect } from 'react-redux'
import { players } from '../constants/Data'
import { setSettings } from '../actions'

@connect(
  state => ({
    settings: state.settings
  }),
  {
    setSettings,
  }
)
export default class SettingsItemScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)

    this._settingsComponent.bind(this)
  }

  _settingsComponent () {
    switch(this.props.navigation.state.params.key) {
      case 'notifications':
        return <SettingsNotifications settings={this.props.settings} save={this.props.setSettings} styles={styles}/>
        break
      case 'favPlayer':
        return <SettingsFavPlayer settings={this.props.settings} save={this.props.setSettings} styles={styles}/>
        break
      default:
        return <View />
    }
  }

  _getTitle () {
    switch(this.props.navigation.state.params.key) {
      case 'notifications':
        return 'Notifications'
        break
      case 'favPlayer':
        return 'Favourite Player'
        break
      default:
        return ''
    }
  }

  render() {
    const settingsComponent = this._settingsComponent()
    const title = this._getTitle()
    return (
      <ScrollView style={styles.container}>
        <View style={[styles.section, styles.sectionContainer]}>
          <SubTitle />
          <View style={styles.titleContainer}>
            <Ionicons
              name='ios-arrow-back'
              size={35}
              style={{paddingRight: 12, marginTop: 2}}
              onPress={() => this.props.navigation.goBack() }/>
            <Title>{ title }</Title>
          </View>
        </View>
        <View style={[styles.section]}>
          { settingsComponent }
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
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  listItem: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 12,
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
