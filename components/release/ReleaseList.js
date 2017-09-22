import React from 'react'
import { View, ScrollView, StyleSheet, ActivityIndicator, Image, Text } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import { NavigationActions } from 'react-navigation'
import { MonoText } from '../StyledText'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

@graphql(gql`
  query ($search: String) {
    releases:fuzzySearch(search: $search) {
      id
      main_artist {
        name
      }
      title
    }
  }
`, {
  options: props => ({
    variables: {
      search: props.search,
    }
  })
})

export default class ReleaseList extends React.Component {

  constructor(props) {
    super(props);
  }

  navigateToUrl(releaseId) {
    const actionToDispatch = NavigationActions.navigate({
      routeName: 'Release',
      params: {
        releaseId
      }
    })
    this.props.navigation.dispatch(actionToDispatch)
  }

  releaseLine (release) {
    return `${release.main_artist.name} - ${release.title}`
  }

  render() {
    if (this.props.data.error || this.props.data.networkStatus == 8) {
      return (
        <View>
          <Text>Something went wrong..</Text>
          <MonoText>{ this.props.data.error.message }</MonoText>
        </View>
      )
    }

    if (this.props.searchPending || this.props.data.networkStatus !== 7) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            animating={ true }
            style={[styles.centering, {height: 80}]}
            size="large"
          />
        </View>
      )
    }

    if (!this.props.data.releases || this.props.data.releases.length == 0) {
      return (
        <View style={styles.imageContainer}>
          <Image
            source={ require('../../assets/images/robot-prod.png') }
            style={styles.imageObject}
          />
        </View>
      )
    }

    return (
      <ScrollView style={styles.container}>
        <List containerStyle={{marginBottom: 20}}>
          {
            this.props.data.releases.map((release, index) => (
              <ListItem
                key={index}
                title={this.releaseLine(release)}
                onPress={() => { this.navigateToUrl(release.id)} }
              />
            ))
          }
        </List>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  imageObject: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
})
