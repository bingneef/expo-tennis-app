import React from 'react'
import { StyleSheet, View } from 'react-native'
import _ from 'lodash'
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
} from 'react-native-elements'
import { SearchBar } from 'react-native-elements'

import ReleaseList from '../components/release/ReleaseList';

export default class SearchScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      search: '',
      searchPending: false,
    }

    this.updateSearch = this.updateSearch.bind(this)

    this.searchDiscogsDelayed = _.debounce(this.searchDiscogs, 1000);
  }

  searchDiscogs ({search}) {
    this.setState({search: search, searchPending: false})
  }

  updateSearch(search) {
    this.setState({search, searchPending: true})
    this.searchDiscogsDelayed({ search })
  }

  render() {
    const seachTermPresent = Boolean(this.state.search)

    return (
      <View style={styles.container}>
        <SearchBar
          lightTheme
          containerStyle={ styles.searchContainerStyle }
          inputStyle={styles.inputStyle}
          onChangeText={ this.updateSearch.bind(this) }
          showLoadingIcon={ this.state.searchPending}
          clearIcon
          placeholder='Start searching' />

        {
          seachTermPresent ? (
            <ReleaseList
              navigation= { this.props.navigation }
              search={ this.state.search }
              searchPending={ this.state.searchPending } />
          ) : ( <View />)
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop: 25,
  },
  searchContainerStyle: {
    backgroundColor: '#F7F7F7',
    borderColor: 'white',
    marginBottom: 0,
  },
  inputStyle: {
    backgroundColor: '#F7F7F7',
  }
})
