import Store, { thunk } from 'repatch'

const hydrate = store => next => async reducer => {
  const state = store.getState()
  const nextState = reducer(state)
  await Expo.SecureStore.setItemAsync('rehydrate', JSON.stringify(nextState))
  return next(_ => nextState)
}

const store = new Store(
  {
    user: {},
    settings: {
      favPlayer: 'bogus',
      notifications: {
        newsAlerts: false,
        gameAlerts: false,
      },
    },
  },
)
.addMiddleware(hydrate)
.addMiddleware(thunk)

export default store
