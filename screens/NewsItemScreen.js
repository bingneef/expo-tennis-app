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
import { Title, SubTitle, SectionTitle, SFText } from '../components/StyledText'
import Card from '../components/card'
import moment from 'moment'
import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import ParallaxView from 'react-native-parallax-view'


import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

@graphql(gql`
  query($newsItemId: String!) {
    newsItem:newsItemById(newsItemId: $newsItemId) {
      id
      title
      content
      image {
        url
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
    return (
      <View style={styles.container}>
        <ParallaxView
          backgroundSource={{uri: newsItem.image.url}}
          windowHeight={200}
          scrollableViewStyle={{ height: '100%', backgroundColor: 'white' }}>
          <View style={styles.contentContainer}>
            <View style={styles.section}>
              <SubTitle>By Bing Steup</SubTitle>
              <Title style={styles.title}>{ newsItem.title }</Title>
            </View>

            <View style={styles.section}>
              <SFText>{ newsItem.content }</SFText>
            </View>
          </View>
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
    height: '100%',
  },
  contentContainer: {
    paddingTop: 12,
  },
  section: {
    padding: 24,
    paddingTop: 0,
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
})
