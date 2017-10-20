import React from 'react'
import {
  Image,
  StyleSheet,
  ActivityIndicator,
  View,
  ScrollView,
} from 'react-native'
import { Button, List, ListItem } from 'react-native-elements'
import { NavigationActions } from 'react-navigation'
import { SFText, Title, SubTitle } from '../components/StyledText'
import { connect } from 'react-redux'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { setSettings } from '../actions'

const getiOSNotificationPermission = async () => {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

const list = [
  {
    title: 'Favorite player',
    icon: 'star',
  },
]

@graphql(gql`
  query {
    currentUser{
      givenName
      photoUrl
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
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
  }

  async logout () {
    await Expo.SecureStore.deleteItemAsync('UserStore.token')
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Register'})
      ]
    })
    this.props.navigation.dispatch(resetAction)
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
            <Title>{this.props.data.currentUser.givenName}</Title>
            <Image
              style={styles.avatar}
              source={{uri: this.props.data.currentUser.photoUrl}}/>
          </View>
        </View>
        <View style={[styles.section, styles.sectionContainer, {flex: 1}]}>
          <List style={{borderWidth: 0}}>
            {
              list.map((item, i) => (
                <ListItem
                  key={i}
                  title={item.title}
                  subtitle={item.subtitle}
                  rightIcon={{name: item.icon}}
                  onPressRightIcon={this._handleButtonPress}
                  style={styles.listItem}
                />
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
    borderWidth: 0,
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
  },
})
