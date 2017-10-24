import React from 'react'
import {
  Image,
  StyleSheet,
  ActivityIndicator,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { List, ListItem, SearchBar } from 'react-native-elements'
import { NavigationActions } from 'react-navigation'
import ModalPicker from 'react-native-modal-selector'
import { SFText, Title, SubTitle } from '../components/StyledText'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Ionicons } from '@expo/vector-icons'

import { players } from '../constants/Data'
import { setSettings } from '../actions'

const list = [
  {
    key: 'favPlayer',
    title: 'Favorite player',
    icon: 'ios-heart-outline',
  },
  {
    key: 'notifications',
    title: 'Notifications',
    icon: 'ios-megaphone-outline',
  },
]

@graphql(gql`
  query {
    tournaments:apiTournaments{
      id
      externalId
      name
    }
  }
`, {
  options: props => ({
    variables: { },
    fetchPolicy: 'cache-and-network',
  })
})
@connect(
  state => ({
    settings: state.settings
  }),
  {
    setSettings,
  }
)
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      refreshing: false,
    }

    this.gotoTournament = this.gotoTournament.bind(this)
    this.setSearch = this.setSearch.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
  }

  setSearch (value) {
    this.setState({
      search: value,
    })
  }

  gotoTournament (tournamentId) {
    const actionToDispatch = NavigationActions.navigate({
      routeName: 'Results',
      params: {
        tournamentId
      }
    })
    this.props.navigation.dispatch(actionToDispatch)
  }

  tournamentTitle (value) {
    try {
      return value.split(',')[0].trim()
    } catch (e) {
      return value
    }
  }

  tournamentSubTitle (value) {
    try {
      return value.split(',')[1].trim()
    } catch (e) {
      return null
    }
  }

  async _onRefresh () {
    this.setState({refreshing: true})
    await this.props.data.refetch()
    this.setState({refreshing: false})
  }

  render() {
    if (this.props.data.loading && !this.state.refreshing) {
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

    return (
      <ScrollView style={styles.container} refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />}>
        <View style={[styles.section, styles.sectionContainer]}>
          <SubTitle />
          <Title>Tournaments</Title>
        </View>
        <View style={[styles.section]}>
          <SearchBar
            lightTheme
            containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
            inputStyle={{backgroundColor: 'transparent', borderWidth: 0}}
            onChangeText={this.setSearch}
            autoCorrect={false}
            placeholder='Search tournament' />
          <List style={{borderWidth: 0}}>
            {
              this.props.data.tournaments
              .filter(item => item.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1)
              .map((item, i) => (
                <TouchableOpacity
                  onPress={() => this.gotoTournament(item.id)}
                  key={i}>
                  <ListItem
                    title={this.tournamentTitle(item.name)}
                    subtitle={this.tournamentSubTitle(item.name)}
                    titleStyle={styles.titleStyle}
                    subtitleStyle={styles.subTitleStyle}
                    rightIcon={<Ionicons name='ios-arrow-forward' size={32} />}
                    style={styles.listItem} />
                </TouchableOpacity>
              ))
            }
          </List>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingTop: 24,
    paddingBottom: 24,
    flex: 1,
    display: 'flex',
  },
  contentContainerStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    borderWidth: 0,
  },
  section: {
    paddingTop: 0,
    paddingBottom: 24,
  },
  sectionContainer: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItem: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: -1,
    borderColor: '#d6d7da',
    display: 'flex',
    alignItems: 'center',
  },
  titleStyle: {
    fontFamily: 'sf-pro',
    fontSize: 16,
  },
  subTitleStyle: {
    fontFamily: 'sf-pro',
    fontSize: 10,
  },
})
