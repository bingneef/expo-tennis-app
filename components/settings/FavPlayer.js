import React from 'react'
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native'
import { List, ListItem, SearchBar } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'

const list = [
  {
    key: 'nadal',
    title: 'Rafael Nadal',
  },
  {
    key: 'federer',
    title: 'Roger Federer',
  },
  {
    key: 'konta',
    title: 'Johanna Konta',
  },
]

export default class SettingsNotifications extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: '',
    }

    this.setFavouritePlayer = this.setFavouritePlayer.bind(this)
    this.setSearch = this.setSearch.bind(this)
    this._itemIcon = this._itemIcon.bind(this)
  }

  componentWillMount () {
    this.setState({
      favPlayer: this.props.settings.favPlayer,
    })
  }

  setSearch (value) {
    this.setState({
      search: value,
    })
  }

  setFavouritePlayer (favPlayer) {
    this.setState({
      favPlayer
    })

    this.saveFavouritePlayer(favPlayer)
  }

  saveFavouritePlayer (favPlayer) {
    const settings = {
      ...this.props.settings,
      favPlayer,
    }
    this.props.save(settings)
  }

  _itemIcon (key) {
    if (key == this.state.favPlayer) {
      return <Ionicons name='md-checkmark' size={32} />
    } else {
      return <View style={styles.iconPlaceholder}/>
    }
  }

  render() {
    return (
      <View>
        <SearchBar
          lightTheme
          containerStyle={{backgroundColor: 'transparent', borderWidth: 0}}
          inputStyle={{backgroundColor: 'transparent', borderWidth: 0}}
          onChangeText={this.setSearch}
          autoCorrect={false}
          placeholder='Search players' />
        <List style={{borderWidth: 0}}>
          {
            list
            .filter(item => item.title.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1)
            .map(item => (
              <TouchableOpacity
                onPress={() => this.setFavouritePlayer(item.key)}
                key={item.key} >
                <ListItem
                  title={item.title}
                  titleStyle={this.props.styles.titleStyle}
                  rightIcon={this._itemIcon(item.key)}
                  style={this.props.styles.listItem} />
              </TouchableOpacity>
            ))
          }
        </List>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  iconPlaceholder: {
    height: 35,
  },
})
