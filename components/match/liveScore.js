import React from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import PlayerRow from './PlayerRow'
import { List, ListItem } from 'react-native-elements'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import withData from '../../services/graphql/matchSubscription'

class MatchLiveScore extends React.Component {
  constructor(props) {
    super(props);
    this.convertedGameScore = this.convertedGameScore.bind(this)
  }

  componentWillMount() {
    this.props.subscribeToPointAdded()
  }

  mapMatchStatus (status) {
    if (status == 'PLANNED') {
      return 'NOT STARTED'
    } else if (status == 'PROGRESS') {
      return 'IN PROGRESS'
    } else {
      return 'COMPLETE'
    }
  }

  convertedGameScore (home) {
    if (this.props.data.match.status !== 'PROGRESS') {
      return null
    }
    try {
      const score = this.props.data.match.currentScore.currentGamePoints
      let deuce = false
      if (score.home + score.away >= 6) {
        if ((home && score.home > score.away) || (!home && score.away > score.home)) {
          return 'A'
        } else {
          return '40'
        }
      }
      if (home) {
        return this.convertScoreToName(score.home)
      } else {
        return this.convertScoreToName(score.away)
      }
    } catch (e) {
      return '00'
    }
  }

  convertScoreToName (score) {
    switch (score) {
      case 1:
        return '15'
      case 2:
        return '30'
      case 3:
        return '40'
      default:
        return '00'
    }
  }

  render() {
    if (!this.props.data || !this.props.data.match) {
      return <View />
    }

    const match = this.props.data.match
    const setNumbers = [1, 2, 3];

    return (
      <View style={styles.container}>
        <PlayerRow
          name={match.homePlayer.fullName}
          currentSetGames={ { score: match.currentScore.currentSetGames.home } }
          currentGameScore={ this.convertedGameScore(true) }
          playerWon={ match.status == 'HOME_WINNER' }
          playerLost={ match.status == 'AWAY_WINNER' }
          completedSets={match.currentScore.completedSetScores.map(set => ({ score: set.home, won: set.home > set.away }))} />
        <View style={styles.gameStatusRow}>
          <Text style={styles.gameStatusField}>{ this.mapMatchStatus(match.status) }</Text>
          {
            setNumbers.map(number => <Text key={number} style={styles.setNumberField}>{number}</Text>)
          }
        </View>
        <PlayerRow
          name={match.awayPlayer.fullName}
          currentSetGames={ { score: match.currentScore.currentSetGames.away } }
          currentGameScore={ this.convertedGameScore(false) }
          playerWon={ match.status == 'AWAY_WINNER' }
          playerLost={ match.status == 'HOME_WINNER' }
          completedSets={match.currentScore.completedSetScores.map(set => ({ score: set.away, won: set.away > set.home }))} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    marginBottom: 6,
    // marginLeft: 12,
    // marginRight: 12,
    backgroundColor: '#F6F6F6',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
    shadowColor: 'rgb(0,0,0)',
    shadowOffset: {
      height: 6,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  gameStatusRow: {
    backgroundColor: '#E5E5E5',
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
  },
  gameStatusField: {
    flex: 1,
    fontSize: 10,
  },
  setNumberField: {
    width: 32,
    textAlign: 'center',
    fontSize: 10,
  }
})
export default withData(MatchLiveScore)
