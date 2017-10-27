import { Permissions, Notifications, Constants } from 'expo'
const env = Constants.manifest.extra.env

export const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  )
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    finalStatus = status
  }

  return await Notifications.getExpoPushTokenAsync()
}
