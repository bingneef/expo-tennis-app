import React from 'react'
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
} from 'react-native'
import { Button } from 'react-native-elements'
import { NavigationActions } from 'react-navigation'
import { graphql, withData } from 'react-apollo'
import gql from 'graphql-tag'
import { Constants } from 'expo'
const env = Constants.manifest.extra.env

@graphql(gql`
  mutation($token: String) {
    validateToken(token: $token){
      token
    }
  }
`, {
  name : 'validateToken',
  options: props => ({
    variables: {
      token: null,
    },
    fetchPolicy: 'network-only',
  })
})
@graphql(gql`
  mutation($user: UserInput) {
    createOrUpdateUser(user: $user){
      token
    }
  }
`, {
  name : 'createOrUpdateUser',
  options: props => ({
    variables: {
      user: null,
    },
    fetchPolicy: 'network-only',
  })
})
export default class RegisterScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      initialCheckDone: false,
      inProgress: false,
    }
  }

  async googleLogin () {
    this.setState({inProgress: true})
    try {
      const result = await Expo.Google.logInAsync({
        iosClientId: env.googleOAuth.ios,
        androidClientId: env.googleOAuth.android,
        iosStandaloneAppClientId: env.googleOAuth.iosStandalone,
        scopes: ['profile', 'email'],
      })

      if (result.type === 'success') {
        const user = {
          email: result.user.email,
          familyName: result.user.familyName,
          givenName: result.user.givenName,
          externalId: result.user.id,
          name: result.user.name,
          photoUrl: result.user.photoUrl,
        }

        const serverResponse = await this.props.createOrUpdateUser({variables: { user }})
        const token = serverResponse.data.createOrUpdateUser.token

        await Expo.SecureStore.setItemAsync('UserStore.token', token)
        return this.navigateToMain()
      } else {
        console.log('Something went wrong..')
      }
    } catch (e) {
      console.log(e)
    }

    this.setState({inProgress: false})
  }

  async navigateToMain () {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Main'})
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }

  async componentWillMount () {
    const token = await Expo.SecureStore.getItemAsync('UserStore.token')
    if (token) {
      try {
        this.setState({inProgress: true})
        const tokenResponse = await this.props.validateToken({variables: { token }})
        if (tokenResponse.data.validateToken.token) {
          return this.navigateToMain()
        } else {
          await Expo.SecureStore.deleteItemAsync('UserStore.token')
          this.setState({initialCheckDone: true, inProgress: false})
        }
      } catch (e) {
        await Expo.SecureStore.deleteItemAsync('UserStore.token')
        this.setState({initialCheckDone: true, inProgress: false})
      }
    } else {
      this.setState({initialCheckDone: true})
    }
  }

  render() {
    if (this.state.inProgress) {
      return (
        <View style={styles.container}>
          <Image
          style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              resizeMode: 'contain',
            }}
            source={ require('../assets/images/spaceballs-bg.jpg') } />
          <ActivityIndicator
            animating={ true }
            style={{height: 80}}
            size="large"
          />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Image
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            resizeMode: 'contain',
          }}
          source={ require('../assets/images/spaceballs-bg.jpg') } />
        { this.state.initialCheckDone && (
          <Button
            buttonStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
            containerViewStyle={styles.containerViewStyle}
            title={`Login with Google`}
            onPress={() => this.googleLogin()}
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  buttonStyle: {
    backgroundColor: 'white',
    width: '100%',
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: 'sf-pro',
    color: '#04A9F4',
    fontSize: 18,
  },
  containerViewStyle: {
    width: '100%',
    marginLeft: 0,
  }
})

