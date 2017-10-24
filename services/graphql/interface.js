import ApolloClient, { createNetworkInterface } from 'apollo-client'
import {SubscriptionClient, addGraphQLSubscriptions} from 'subscriptions-transport-ws'
import { Constants } from 'expo'
const env = Constants.manifest.extra.env

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
export const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
})
