import React from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import s from 'underscore.string'
import moment from 'moment'
import { Title, SubTitle, SFText } from '../components/StyledText'
import Card from '../components/matchCard'
import { Ionicons } from '@expo/vector-icons'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

@graphql(gql`
  query($tournamentId: String) {
    matches:apiMatches(tournamentId: $tournamentId) {
      id
      status
      matchStatus
      externalId
      homeScore
      awayScore
      tournament {
        name
        kind
        gender
      }
      venue {
        name
      }
      round {
        name
      }
      season {
        year
      }
      competitors{
        name
        team
        countryCode
      }
      periodScores {
        homeScore
        awayScore
        number
      }
    },
  }
`, {
  options: props => ({
    variables: {
      tournamentId: props.navigation.state.params.tournamentId
    },
    fetchPolicy: 'network-only',
  })
})
export default class ResultsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
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

  subTitle (match) {
    let str = `${s(match.tournament.gender).capitalize().value()}'s ${s(match.tournament.kind).capitalize().value()}`
    if (match.round && match.round.name) {
      str = `${str}  • ${s(match.round.name).capitalize().value()}`
    }
    return str
  }

  todayString () {
    return moment().format('MMMM Do YYYY')
  }

  render() {
    if (this.props.data.loading && !this.state.refreshing) {
      return (
        <View style={styles.container}>
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
          onRefresh={this._onRefresh}
        />}>
        <View style={[styles.section, styles.sectionContainer]}>
          <SubTitle>{this.todayString().toUpperCase()}</SubTitle>
          <View style={{display: 'flex', flexDirection: 'row',}}>
            <Ionicons
              name='ios-arrow-back'
              size={35}
              style={{paddingRight: 12, marginTop: 2}}
              onPress={() => this.props.navigation.goBack() }/>
            <Title>Results</Title>
          </View>
        </View>
        {
          this.props.data.matches.map(match => {
            const homePlayer = match.competitors.filter(item => item.team == 'home')[0]
            const awayPlayer = match.competitors.filter(item => item.team == 'away')[0]
            const venue = match.venue ? match.venue.name : 'COURT UNKNOWN'

            return (
              <View key={match.id}>
                <Card
                  style={styles.cardStyle}
                  title={venue}
                  subTitle={ this.subTitle(match) }
                  sets={ match.periodScores }
                  homePlayerName={ `${homePlayer.name} (${homePlayer.countryCode})` }
                  awayPlayerName={ `${awayPlayer.name} (${awayPlayer.countryCode})` } />
              </View>
            )
          })
        }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: 'white',
    flex: 1,
  },
  cardStyle: {
    marginBottom: 12,
  }
})
