import React from 'react'
import { View, Text, Switch } from 'react-native'
import { List, ListItem } from 'react-native-elements'

export default class SettingsNotifications extends React.Component {
  constructor(props) {
    super(props)

    this.setNewsAlerts = this.setNewsAlerts.bind(this)
    this.setGameAlerts = this.setGameAlerts.bind(this)
  }

  componentWillMount () {
    this.setState({
      notifications: this.props.settings.notifications,
    })
  }

  setNewsAlerts (value) {
    const notifications = {
      ...this.state.notifications,
      newsAlerts: value,
    }

    this.setState({
      notifications
    })

    this.saveNotifications(notifications)
  }

  setGameAlerts (value) {
    const notifications = {
      ...this.state.notifications,
      gameAlerts: value,
    }

    this.setState({
      notifications
    })

    this.saveNotifications(notifications)
  }

  saveNotifications (notifications) {
    const settings = {
      ...this.props.settings,
      notifications,
    }
    this.props.save(settings)
  }

  render() {
    return (
      <View style={this.props.styles.sectionContainer}>
        <List style={{borderWidth: 0}}>
          <ListItem
            title='News alerts'
            titleStyle={this.props.styles.titleStyle}
            rightIcon={
              <Switch
                value={this.state.notifications.newsAlerts}
                onValueChange={this.setNewsAlerts} />
            }
            style={this.props.styles.listItem} />

          <ListItem
            title='Game alerts'
            titleStyle={this.props.styles.titleStyle}
            rightIcon={
              <Switch
                value={this.state.notifications.gameAlerts}
                onValueChange={this.setGameAlerts} />
            }
            style={this.props.styles.listItem} />
        </List>
      </View>
    )
  }
}
