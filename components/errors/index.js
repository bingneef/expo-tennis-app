import React from 'react';
import { Text } from 'react-native';

export class Unauthorized extends React.Component {
  render() {
    return (
      <Text
        style={[this.props.style, { fontFamily: 'sf-pro-bold' }]}>
        Unauthorized.
      </Text>
    );
  }
}

export class Unknown extends React.Component {
  render() {
    return (
      <Text
        style={[this.props.style, { fontFamily: 'sf-pro-bold' }]}>
        An unknown error occured.
      </Text>
    );
  }
}
