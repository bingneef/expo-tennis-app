export const setHydrated = (rehydratedState) => {
  return state => {
    return {
      ...state,
      settings: {
        ...state.settings,
        ...rehydratedState.settings
      },
      rehydrated: true,
    }
  }
}

export const rehydrate = delta => state => async (dispatch, getState) => {
  try {
    const stringified = await Expo.SecureStore.getItemAsync('rehydrate')
    return dispatch(setHydrated(JSON.parse(stringified)))
  } catch (e) {
    return dispatch(setHydrated({}))
  }
}
