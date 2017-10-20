import RootNavigator, { RootStackNavigator } from '../navigation/RootNavigation'

export const setSettings = settings => {
  return state => ({ ...state, settings })
}

export { setHydrated, rehydrate } from './rehydrate'
