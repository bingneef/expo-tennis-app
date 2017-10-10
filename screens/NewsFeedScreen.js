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
import { Title, SubTitle, SectionTitle } from '../components/StyledText'
import Card from '../components/card'
import ListItem from '../components/listItem'
import { Unauthorized, Unknown } from '../components/errors'
import moment from 'moment'
import { NavigationActions } from 'react-navigation'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

@graphql(gql`
  query {
    featured:newsItems(featured: true) {
      id
      title
      image {
        url
      }
      tags
    },
    tennis:newsItems(tag: "tennis") {
      id
      title
      image {
        url
      }
      tags
      excerpt(size: 200)
    },
    favPlayer:newsItems(tag: "nadal") {
      id
      title
      image {
        url
      }
      tags
    },
  }
`, {
  options: props => ({
    variables: {
      featured: true,
    },
    fetchPolicy: 'network-only',
  })
})
export default class NewsFeedScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
    }

    this.todayString = this.todayString.bind(this)
    this.navigateToItem = this.navigateToItem.bind(this)
    this._renderCard = this._renderCard.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
  }

  todayString () {
    return moment().format('MMMM Do YYYY')
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
        <Card title={item.title} superTitle={this.tagLine(item)} subTitle={this.todayString()} source={{uri: item.image.url}} />
      </TouchableOpacity>
    )
  }

  _renderListItem ({data, index}) {
    return (
      <TouchableOpacity key={data.id} activeOpacity={0.8} onPress={() => this.navigateToItem(data.id)}>
        <ListItem key={ index } title={data.title} superTitle={this.tagLine(data)} content={data.excerpt} source={{uri: data.image.url}} />
      </TouchableOpacity>
    )
  }

  async _onRefresh () {
    this.setState({refreshing: true})
    await this.props.data.refetch()
    this.setState({refreshing: false})
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

    if (this.props.data.error) {
      const message = this.props.data.error.message == 'GraphQL error: UNAUTHORIZED' ? 'You are not authorized.' : 'An unknown error occured. Nothing we can do.'
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
            this._renderCard({item: this.props.data.featured[0], index: 0})
          }
        </View>

        <View style={styles.section}>
          <View style={styles.sectionContainer}>
            <SectionTitle>Nadal</SectionTitle>
          </View>
          <View>
            {
              this._renderSlider({data: this.props.data.favPlayer, ref: this._carousel})
            }
          </View>
        </View>

        <View style={[styles.section, styles.sectionContainer]}>
          <SectionTitle>Other news</SectionTitle>
          {
            this.props.data.tennis.map((data, index) => this._renderListItem({data, index}))
          }
        </View>
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
