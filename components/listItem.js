import React from 'react'
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
} from 'react-native'
import {
  Title,
  SFText,
} from './StyledText'

class ListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <Image
          style={{
            width: 80,
            height: 80,
            borderRadius: 4,
          }}
          source={this.props.source} />
        <View style={styles.contentSection}>
          <SFText bold={true} style={styles.title}>{this.props.title}</SFText>
          <SFText style={styles.content} ellipsizeMode="tail" numberOfLines={4}>{this.props.content}</SFText>
        </View>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 6,
    paddingTop: 6,
    display: 'flex',
    flexDirection: 'row',
  },
  contentSection: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
  },
  content: {
    fontSize: 12,
    color: '#89888E',
  },
})
export default ListItem
