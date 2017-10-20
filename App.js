import React from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import { AppLoading, Asset, Font, Constants } from 'expo'
import { Ionicons } from '@expo/vector-icons'
import RootNavigation from './navigation/RootNavigation'
import { NavigationActions } from 'react-navigation'

import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider, graphql } from 'react-apollo'
import { Provider } from 'react-redux'
import Sentry from 'sentry-expo'
import ErrorBoundary from './components/ErrorBoundary'
import store from './store'
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws'

const env = Constants.manifest.extra.env

Sentry.enableInExpoDevelopment = true
Sentry.config(env.sentry.token).install();

const wsClient = new SubscriptionClient(`ws://${env.serverUrl}/subscriptions`, {
  reconnect: true
})

// Create a normal network interface:
const networkInterface = createNetworkInterface({
  uri: `http://${env.serverUrl}/graphql`
})

networkInterface.use([{
  async applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    const token = await Expo.SecureStore.getItemAsync('UserStore.token')
    if (token) {
      req.options.headers['x-auth'] = token
    }
    next()
  }
}])

networkInterface.useAfter([{
  async applyAfterware({ response }, next) {
    try {
      const body = JSON.parse(response._bodyText)
      if (body.errors.filter(error => error.message == 'UNAUTHORIZED').length > 0) {
        await Expo.SecureStore.deleteItemAsync('UserStore.token')

        // FIXME: Tell user about issue
      }
    } catch (e) { }
    next();
  }
}]);

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)
// Finally, create your ApolloClient instance with the modified network interface
const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
})

export default class App extends React.Component {
  state = {
    assetsAreLoaded: false,
  }

  async componentWillMount () {
    this._loadAssetsAsync()
  }

  render() {
    if (!this.state.assetsAreLoaded && !this.props.skipLoadingScreen) {
      return <AppLoading />
    } else {
      return (
        <Provider store={store}>
          <ErrorBoundary>
            <ApolloProvider client={client}>
              <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                {Platform.OS === 'android' &&
                  <View style={styles.statusBarUnderlay} />}
                <RootNavigation />
              </View>
            </ApolloProvider>
          </ErrorBoundary>
        </Provider>
      )
    }
  }

  async _loadAssetsAsync() {
    try {
      await Promise.all([
        Asset.loadAsync([
          require('./assets/images/spaceballs-bg.jpg'),
        ]),
        Font.loadAsync([
          Ionicons.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
          { 'open-sans': require('./assets/fonts/OpenSans-Regular.ttf') },
          { 'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf') },
          { 'sf-pro': require('./assets/fonts/SF-Pro-Text-Medium.otf') },
          { 'sf-pro-bold': require('./assets/fonts/SF-Pro-Text-Bold.otf') },
          { 'sf-pro-black': require('./assets/fonts/SF-Pro-Display-Black.otf') },
        ]),
      ])
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: App.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      )
      console.log(e)
    } finally {
      this.setState({ assetsAreLoaded: true })
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'white',
  },
})
