import React from 'react'
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { Title, SubTitle, SectionTitle, SFText } from '../components/StyledText'
import Card from '../components/card'
import ListItem from '../components/listItem'
import { Unauthorized, Unknown } from '../components/errors'
import moment from 'moment'
import { NavigationActions } from 'react-navigation'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const limit = 10

@graphql(gql`
  query($favPlayer: String!, $cursor: Int) {
    featured:newsItems(featured: true) {
      feed {
        id
        title
        image {
          url
        }
        tags
        pubDateTimestamp
      }
    },
    favPlayer:newsItems(tag: $favPlayer) {
      feed {
        id
        title
        image {
          url
        }
        tags
        pubDateTimestamp
      }
    },
    newsItems:newsItems(cursor: $cursor, limit: ${limit}, notTag: $favPlayer) {
      feed {
        id
        title
        image {
          url
        }
        pubDateTimestamp
      }
      totalCount
    },
  }
`, {
  options: props => ({
    variables: {
      favPlayer: 'nadal',
      cursor: 0,
    },
    fetchPolicy: 'cache-and-network',
  }),
  props({ data: { loading, featured, favPlayer, newsItems, fetchMore, refetch } }) {
    return {
      loading,
      newsItems,
      featured,
      favPlayer,
      refetch,
      loadMoreNewsItems() {
        return fetchMore({
          variables: {
            cursor: newsItems.feed.length,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) { return previousResult }

            const feed = [...previousResult.newsItems.feed, ...fetchMoreResult.newsItems.feed]

            return Object.assign({}, previousResult, {
              newsItems: {
                ...previousResult.newsItems,
                feed,
              },
            })
          },
        })
      }
    }
  },
})
export default class NewsFeedScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      loadingMore: false,
    }

    this.todayString = this.todayString.bind(this)
    this.navigateToItem = this.navigateToItem.bind(this)
    this._renderCard = this._renderCard.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    this._onloadMore = this._onRefresh.bind(this)
  }

  todayString () {
    return moment().format('MMMM Do YYYY')
  }

  dateString (date) {
    return moment(date).format('MMMM Do YYYY')
  }

  navigateToItem (id) {
    const navigateAction = NavigationActions.navigate({
      routeName: 'DetailNewsItem',
      params: {
        id,
      },
    })

    this.props.navigation.dispatch(navigateAction)
  }

  tagLine (item) {
    if (item.tags) {
      return item.tags.join(', ').toUpperCase()
    }
    return null
  }

  _renderSlider ({data, ref}) {
    return (
      <View style={styles.sliderSection}>
        <Carousel
          ref={(c) => { ref = c }}
          data={data}
          renderItem={this._renderCard}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width - 36}
          enableMomentum={true}
          decelerationRate='fast'
          enableSnap={true}
          containerCustomStyle={{paddingLeft: 24}}
          slideStyle={{paddingRight: 12}}
          activeSlideAlignment='start'
          inactiveSlideOpacity={1.0}
          inactiveSlideScale={1.0} />
      </View>
    )
  }

  _renderCard ({item, index}) {
    return (
      <TouchableOpacity style={{width: Dimensions.get('window').width - 48}} key={item.id} activeOpacity={0.8} onPress={() => this.navigateToItem(item.id)}>
        <Card title={item.title} superTitle={this.tagLine(item)} subTitle={this.dateString(item.pubDateTimestamp)} source={{uri: item.image.url}} />
      </TouchableOpacity>
    )
  }

  _renderListItem ({item, index}) {
    return (
      <TouchableOpacity key={item.id} activeOpacity={0.8} onPress={() => this.navigateToItem(item.id)}>
        <ListItem key={ index } title={item.title} content={this.dateString(item.pubDateTimestamp)} source={{uri: item.image.url}} />
      </TouchableOpacity>
    )
  }

  async _onRefresh () {
    this.setState({refreshing: true})
    await this.props.refetch({cursor: 0})
    this.setState({refreshing: false})
  }

  async _loadMore () {
    this.setState({loadingMore: true})
    await this.props.loadMoreNewsItems()
    this.setState({loadingMore: false})
  }

  render() {
    if (this.props.loading && !this.state.loadingMore && !this.props.featured) {
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

    if (this.props.error) {
      const message = this.props.error.message == 'GraphQL error: UNAUTHORIZED' ? 'You are not authorized.' : 'An unknown error occured. Nothing we can do.'
      return (
        <View style={[styles.container, styles.errorsContainer]}>
          <Title>ERROR</Title>
          <SubTitle>{ message }</SubTitle>
          <Image
            source={ require('../assets/images/error.png') } />
        </View>
      )
    }

    return (
      <ScrollView style={styles.container} refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
        />}>
        <View style={[styles.section, styles.sectionContainer]}>
          <SubTitle>{this.todayString().toUpperCase()}</SubTitle>
          <Title>Newsfeed</Title>
        </View>

        <View style={[styles.section, styles.sectionContainer]}>
          {
            this._renderCard({item: this.props.featured.feed[0], index: 0})
          }
        </View>

        {
          this.props.favPlayer.feed.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionContainer}>
                <SectionTitle>Nadal</SectionTitle>
              </View>
              <View>
                {
                  this._renderSlider({data: this.props.favPlayer.feed, ref: this._carousel})
                }
              </View>
            </View>
          )
        }
        {
          this.props.newsItems.feed.length > 0 && (
            <View style={[styles.section, styles.sectionContainer]}>
              <SectionTitle>Other news</SectionTitle>
              {
                this.props.newsItems.feed.map((item, index) => this._renderListItem({item, index}))
              }
            </View>

          )
        }
        {
          this.props.newsItems.totalCount !==  this.props.newsItems.feed.length && (
            <View style={[styles.section, styles.sectionContainer]}>
              {
                this.state.loadingMore ? (
                  <ActivityIndicator
                    animating={ true }
                    size="large"
                  />
                ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this._loadMore.bind(this)} >
                  <SFText style={{fontSize: 20}}>Load more..</SFText>
                </TouchableOpacity>
                )
              }
            </View>
          )
        }

        <View style={{paddingBottom: 24}} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 24,
    flex: 1,
  },
  errorsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingTop: 0,
    paddingBottom: 24,
  },
  textLine: {
    paddingBottom: 12,
  },
  sectionContainer: {
    paddingLeft: 24,
    paddingRight: 24,
  },
})
