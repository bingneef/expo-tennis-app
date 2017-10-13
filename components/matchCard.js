import React from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native'
import {
  SFText,
} from './StyledText'
import PlayerRow from './match/PlayerRow'

export default class MatchCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const setNumbers = [1, 2, 3]

    const homeSets = this.props.sets.map(set => ({won: set.homeScore > set.awayScore, score: set.homeScore}))
    const awaySets = this.props.sets.map(set => ({won: set.awayScore > set.homeScore, score: set.awayScore}))

    const homeWinner = homeSets.length > 0 && homeSets[homeSets.length - 1].score > awaySets[awaySets.length - 1].score
    const awayWinner = awaySets.length > 0 && awaySets[awaySets.length - 1].score > homeSets[homeSets.length - 1].score

    while (homeSets.length < 3) {
      homeSets.push({})
    }
    while (awaySets.length < 3) {
      awaySets.push({})
    }

    return (
      <View style={[this.props.style, styles.container]}>
        <View style={ styles.topSection }>
          <SFText bold={true} style={styles.title}>{ this.props.title }</SFText>
          <SFText style={styles.subTitle}>{ this.props.subTitle }</SFText>
        </View>
        <View style={styles.scoreSection}>
          <PlayerRow
            name={ this.props.homePlayerName }
            playerWon={ homeWinner }
            completedSets={ homeSets } />
          <View style={styles.gameStatusRow}>
            <SFText style={styles.gameStatusField}>Finished</SFText>
            {
              setNumbers.map(number => <SFText key={number} style={styles.setNumberField}>{number}</SFText>)
            }
          </View>
          <PlayerRow
            name={ this.props.awayPlayerName }
            playerWon={ awayWinner }
            completedSets={ awaySets } />
        </View>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  topSection: {
    alignItems: 'center',
    padding: 8,
  },
  title: {
    fontSize: 18,
    color: '#333',
    letterSpacing: -1,
  },
  subTitle: {
    color: '#89888E',
    fontSize: 12,
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
  },
})
