import React from 'react'
import { Text, StyleSheet } from 'react-native'

export class SFText extends React.Component {
  render() {
    let style = [styles.sf]
    if (this.props.bold) {
      style.push(styles.sfBold)
    }
    style.push(this.props.style)
    return (
      <Text
        {...this.props}
        style={style}
      />
    )
  }
}

export class Title extends React.Component {
  render() {
    return (
      <Text
        {...this.props}
        style={[styles.title, this.props.style]}
      />
    )
  }
}

export class SubTitle extends React.Component {
  render() {
    return (
      <Text
        {...this.props}
        style={[styles.subTitle, this.props.style]}
      />
    )
  }
}

export class SectionTitle extends React.Component {
  render() {
    return (
      <Text
        {...this.props}
        style={[styles.sectionTitle, this.props.style]}
      />
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontFamily: 'sf-pro-black',
    color: '#0F0F0F',
  },
  subTitle: {
    fontSize: 14,
    fontFamily: 'sf-pro',
    color: '#99999B',
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'sf-pro-black',
    color: '#0F0F0F',
  },
  sf: {
    fontFamily: 'sf-pro',
    color: '#0F0F0F',
  },
  sfBold: {
    fontFamily: 'sf-pro-bold',
  }
})
