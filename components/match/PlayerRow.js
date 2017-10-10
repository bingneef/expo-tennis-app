import React from 'react'
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Platform,
} from 'react-native'
import {
  SansText,
} from './../StyledText'
import { Ionicons } from '@expo/vector-icons';
import { List, ListItem } from 'react-native-elements'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

export default class PlayerRow extends React.Component {
  constructor(props) {
    super(props);
    this.setArray = this.setArray.bind(this)
  }

  setArray (completedSets, currentSetGames) {
    const sets = [...completedSets, currentSetGames]
    const setLength = sets.length

    for (let i = 0; i < 3 - setLength; i++) {
      sets.push({})
    }
    return sets
  }

  render() {
    return (
      <View style={ [styles.container, this.props.firstRow && styles.firstRow] }>
        <SansText style={styles.playerNameCol}>{ this.props.name }</SansText>
        {
          this.props.playerWon ? (
            <Ionicons style={styles.gameScoreCol} name="ios-checkmark" size={16} color="green" />
          ) : (
          <SansText style={styles.gameScoreCol}>{ this.props.currentGameScore}</SansText>
          )
        }
        {
          this.setArray(this.props.completedSets, this.props.currentSetGames)
          .map((set, index) => <Text key={index} style={[styles.setCol, set.won && styles.setWon]}>{ set.score } { set.won }</Text>)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: 4,
    marginTop: 1,
    alignItems: 'center',
  },
  firstRow: {
    borderBottomWidth: 2,
    borderColor: 'red',
  },
  playerNameCol: {
    flex: 1,
  },
  winMarkCol: {
    width: 10,
    backgroundColor: 'red'
  },
  gameScoreCol: {
    fontFamily: 'open-sans-bold',
    width: 32,
    textAlign: 'center',
    color: '#555555',
  },
  setCol: {
    color: '#555555',
    fontFamily: 'open-sans-bold',
    width: 32,
    textAlign: 'center',
    color: '#555555',
  },
  setWon: {
    color: '#C85A19',
  },
})
