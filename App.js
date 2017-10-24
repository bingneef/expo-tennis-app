import React from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import { AppLoading, Asset, Font, Constants } from 'expo'
import { Ionicons } from '@expo/vector-icons'
import RootNavigation from './navigation/RootNavigation'

import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'
import store from './store'

import Sentry from 'sentry-expo'
import ErrorBoundary from './components/ErrorBoundary'
import { client } from './services/graphql/interface'
import { defaultStyles } from './styles'

const env = Constants.manifest.extra.env
Sentry.config(env.sentry.token).install()

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
  ...defaultStyles,
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'white',
  },
})
