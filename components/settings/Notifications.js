import React from 'react'
import { View, Text, Switch } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import { registerForPushNotificationsAsync } from '../../services/pushNotifications'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

@graphql(gql`
  mutation($notifications: NotificationsInput) {
    setNotifications(notifications: $notifications){
      pushToken
      newsAlerts
    }
  }
`, {
  name : 'setNotifications',
  options: props => ({
    variables: {
      notifications: {
        pushToken: null,
        newsAlerts: null,
      }
    },
    fetchPolicy: 'network-only',
  })
})
export default class SettingsNotifications extends React.Component {
  constructor(props) {
    super(props)

    this.setNewsAlerts = this.setNewsAlerts.bind(this)
  }

  componentWillMount () {
    this.setState({
      notifications: this.props.settings || {},
    })
  }

  async componentDidMount () {
    if (!this.props.settings || !this.props.settings.pushToken) {
      const pushToken = await registerForPushNotificationsAsync()
      if (pushToken) {
        try {
          await this.props.setNotifications({variables: { pushToken }})
          this.setState({
            notifications: {
              ...this.state.notifications,
              pushToken,
            }
          })
        } catch (e) { console.log(e) }
      }
    }
  }

  async setNewsAlerts (value) {
    const notifications = {
      ...this.state.notifications,
      newsAlerts: value,
    }

    delete notifications.__typename

    await this.props.setNotifications({variables: { notifications }})

    this.setState({ notifications })
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
        </List>
      </View>
    )
  }
}
