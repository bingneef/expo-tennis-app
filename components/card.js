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

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <View style={styles.topSection}>
          <SFText style={styles.superTitle}>{this.props.superTitle}</SFText>
          <SFText ellipsizeMode="tail" numberOfLines={2} bold={true} style={styles.title}>{this.props.title}</SFText>
          <SFText style={styles.subTitle}>{this.props.subTitle}</SFText>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.backgroundView}>
            <Image
              style={{
                flex: 1,
                width: '100%',
                resizeMode: 'cover',
              }}

              source={this.props.source}
            />
          </View>
          <View style={styles.innerContainer} />
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
    paddingTop: 6
  },
  cardContainer: {
    flex: 1,
    height: 200,
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
    shadowColor: 'rgb(0,0,0)',
    shadowOffset: {
      height: 6,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    paddingBottom: 24,
    marginBottom: -24,
  },
  innerContainer: {
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: '100%',
  },
  backgroundView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    height: 40,
  },
  subTitle: {
    color: '#89888E',
  },
  superTitle: {
    color: '#FC4363',
  },
  topSection: {
    paddingBottom: 12,
  }
})
export default Card
