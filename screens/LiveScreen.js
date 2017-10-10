import React from 'react';
import { ScrollView, View, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native'
import { List, ListItem, Card } from 'react-native-elements'
import { Title } from '../components/StyledText'
import MatchLiveScore from '../components/match/liveScore'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

@graphql(gql`
  query {
    matches(archived: false){
      id
    }
  }
`, {
  options: props => ({
    fetchPolicy: 'network-only',
  })
})

export default class ReleaseScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    }

    this._onRefresh = this._onRefresh.bind(this)
  }

  async _onRefresh () {
    this.setState({refreshing: true})
    await this.props.data.refetch()
    this.setState({refreshing: false})
  }

  render() {
    if (!this.props.data.matches) {
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
      <ScrollView style={styles.container} refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
        />}>
        <Title>Live games</Title>
        {
          this.props.data.matches.map((match, index) => <MatchLiveScore key={match.id} matchId={match.id} />)
        }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 24,
  },
  positionText: {
    marginRight: 15,
    width: 30,
  },
})
