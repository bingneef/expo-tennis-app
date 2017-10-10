import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const matchBlock = "id status homePlayer { fullName } awayPlayer { fullName } currentScore { completedSetScores { home away } currentSetGames { home away } currentGamePoints { home away } }"

const MATCH_QUERY = gql`
  query matchById($matchId: String!) {
    match:matchById(matchId: $matchId){
      ${matchBlock}
    }
  }
`

const EVENT_SUBSCRIPTION = gql`
  subscription pointAdded($matchId: String!){
    pointAdded(matchId: $matchId) {
      match {
        ${matchBlock}
      }
    }
  }
`

export default graphql(MATCH_QUERY, {
  name: 'data',
  options: props => {
    return {
      variables: {
        matchId: props.matchId,
      }
    }
  },
  props: props => {
    return {
      ...props,
      subscribeToPointAdded: params => {
        return props.data.subscribeToMore({
          document: EVENT_SUBSCRIPTION,
          variables: {
            matchId: props.ownProps.matchId,
          },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev
            }

            return Object.assign({}, prev, {
              match: subscriptionData.data.pointAdded.match,
            })
          }
        })
      },
    }
  },
})
