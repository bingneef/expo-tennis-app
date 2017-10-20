import React from 'react'
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import s from 'underscore.string'
import { Title, SubTitle, SectionTitle, SFText } from '../components/StyledText'
import Card from '../components/matchCard'
import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import ParallaxView from 'react-native-parallax-view'
import Hr from 'react-native-hr'
import moment from 'moment'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

@graphql(gql`
  query($newsItemId: String!) {
    newsItem:newsItemById(newsItemId: $newsItemId) {
      id
      title
      content
      pubDateTimestamp
      image:imageSized {
        url
      }
      match {
        id
        homeScore
        awayScore
        tournament {
          kind
          gender
        }
        competitors {
          name
          team
          countryCode
        }
        periodScores {
          homeScore
          awayScore
          number
        }
        venue {
          name
        }
        round {
          name
        }
      }
    }
  }
`, {
  options: props => ({
    variables: {
      newsItemId: props.navigation.state.params.id,
    },
    fetchPolicy: 'network-only',
  })
})
export default class NewsItemScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.close = this.close.bind(this)
  }

  close () {
    this.props.navigation.goBack()
  }

  render() {
    if (this.props.data.loading) {
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

    const newsItem = this.props.data.newsItem
    const dateString = moment(newsItem.pubDateTimestamp).format('MMMM Do YYYY')

    let subTitle = null
    let homePlayer = null
    let awayPlayer = null
    let title = null
    if (newsItem && newsItem.match && newsItem.match.id) {
      try {
        title = newsItem.match.venue.name
      } catch (e) { title = 'Centre Court' }
      homePlayer = newsItem.match.competitors.filter(item => item.team == 'home')[0]
      awayPlayer = newsItem.match.competitors.filter(item => item.team == 'away')[0]

      subTitle = `${s(newsItem.match.tournament.gender).capitalize().value()}'s ${s(newsItem.match.tournament.kind).capitalize().value()}`
      try {
        subTitle += ` • ${ s.humanize(newsItem.match.round.name) }`
      } catch (e) { }
    }

    return (
      <View style={styles.container}>
        <ParallaxView
          backgroundSource={{uri: newsItem.image.url}}
          windowHeight={200}
          scrollableViewStyle={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.section}>
              <SubTitle>{ dateString }</SubTitle>
              <Title style={styles.title}>{ newsItem.title }</Title>
            </View>

            <View style={styles.section}>
              <SFText>{ newsItem.content }</SFText>
            </View>
          </View>
          { newsItem.match && newsItem.match.id && (
            <View style={styles.section}>
              <View style={styles.hrSection}>
                <Hr lineColor='#b3b3b3' text='Scorecard' textColor='#333' />
              </View>
              <Card
                style={styles.cardStyle}
                title={ title }
                subTitle={ subTitle }
                sets={ newsItem.match.periodScores }
                homePlayerName={ `${homePlayer.name} (${homePlayer.countryCode})` }
                awayPlayerName={ `${awayPlayer.name} (${awayPlayer.countryCode})` } />
            </View>
          )}
        </ParallaxView>
        <TouchableOpacity onPress={() => this.close()} style={styles.closeIcon}>
          <Ionicons
            name='ios-close-circle'
            size={28}
            color='white'
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  contentContainer: {
    paddingTop: 12,
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  hrSection: {
    paddingBottom: 24,
  },
  imageHeader: {
    height: 200,
    position: 'relative',
    paddingBottom: 24,
  },
  closeIcon: {
    position: 'absolute',
    right: 12,
    top: 24,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
  },
  cardStyle: {
    marginBottom: 12,
    overflow: 'visible',
  },
})
