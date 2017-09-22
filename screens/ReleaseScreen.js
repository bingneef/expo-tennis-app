import React from 'react';
import { ScrollView, View, ActivityIndicator, StyleSheet } from 'react-native'
import { List, ListItem, Card } from 'react-native-elements'
import { MonoText } from '../components/StyledText'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

@graphql(gql`
  query ($releaseId: Int!) {
    release:byReleaseId(releaseId: $releaseId) {
      id
      main_artist {
        name
      }
      title
      tracks {
        position
        title
        duration
      }
    }
  }
`, {
  options: props => ({
    variables: {
      releaseId: props.navigation.state.params.releaseId,
    },
    fetchPolicy: 'cache-and-network',
  })
})

export default class ReleaseScreen extends React.Component {
  static navigationOptions = {
    title: 'Release',
  };

  constructor(props) {
    super(props);
    console.log(this.props.navigation.state.params)
  }

  render() {
    if (!this.props.data.release) {
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
      <ScrollView style={styles.container}>
        <Card
          title={`${this.props.data.release.main_artist.name} - ${this.props.data.release.title}`}>
        </Card>

        <List containerStyle={{marginBottom: 20}}>
          {
            this.props.data.release.tracks.map((track, index) => (
              <ListItem
                key={ index }
                title={ track.title }
                leftIcon={
                  <MonoText style={styles.positionText}>{track.position}</MonoText>
                }
                rightTitle={ track.duration || '-' }
                hideChevron={ true }
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
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  positionText: {
    marginRight: 15,
    width: 30
  },
})
