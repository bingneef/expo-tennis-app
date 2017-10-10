import React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Title, SFText } from '../components/StyledText'
import t from 'tcomb-form-native'
import { gql, graphql } from 'react-apollo'

const Form = t.form.Form
const Point = t.struct({
  status: t.enums({
    'HOME_WINNER': 'Bing Steup',
    'AWAY_WINNER': 'Marijke Boukema',
  }),
  kind: t.maybe(
    t.enums({
      'WINNER': 'Winner',
      'UNFORCED_ERROR': 'Unforced Error',
      'FORCED_ERROR': 'Forced Error',
      'ACE': 'Ace',
      'DOUBLE_FAULT': 'Double Fault',
    }),
  ),
  wing: t.maybe(
    t.enums({
      'FOREHAND': 'Forehand',
      'BACKHAND': 'Backhand',
      'VOLLEY': 'Volley',
      'OVERHEAD': 'Overhead',
    }),
  ),
})

const options = {}

class MatchCenterScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)

    this.addPoint = this.addPoint.bind(this)
  }

  async addPoint () {
    const value = this.refs.form.getValue()
    await this.props.mutate({
      variables: {
        matchId: '59dc76528f4e982f77bc1089',
        status: value.status,
      }
    })
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Title>Add point</Title>
        <Form
          ref="form"
          type={Point}
          options={options}
        />

        <TouchableOpacity style={styles.button} onPress={this.addPoint} underlayColor='#99d9f4'>
          <SFText style={styles.buttonText}>Save</SFText>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 24,
    flex: 1,
  },
})

const addPoint = gql`
  mutation addPoint($matchId: String!, $status: String!) {
    addPoint(matchId: $matchId, status: $status) {
      status
    }
  }
`;
export default graphql(addPoint)(MatchCenterScreen);
