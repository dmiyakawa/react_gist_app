"use strict";

import React from 'react'
import $ from 'jquery'
import GistStore from '../stores/GistStore'
import GistActions from '../actions/GistActions'

import GistList from './GistList.react'
import ReloadButton from './ReloadButton.react'


class GistApp extends React.Component {
  constructor(props) {
    super(props);
    console.log(`source: ${this.props.source}`)
    this.state = this.getGistState();
  }

  getGistState() {
    return {
      isLoading: GistStore.isLoading(),
      url: GistStore.getLoadingUrl(),
      result: GistStore.getResult()
    }
  }
  
  componentWillMount() {
    console.log("GistApp.componentWillMount()")
    GistStore.addChangeListener(this._onChange.bind(this));
  }

  componentDidMount() {
    console.log("GistApp.componentDidMount()")
    GistActions.startLoading(this.props.source);
  }

  componentWillUnmount() {
    console.log("GistApp.componentWillUnmount()")
    GistStore.removeChangeListener(this._onChange);
  }

  render() {
    // console.log(`GistApp.render(${JSON.stringify(this.state, null, ' ')})`);
    console.log(`GistApp.render()`);
    if (this.state.isLoading) {
      return <div>loading...</div>
    }
    let firstResult = this.state.result[0];
    return <div>
      <ReloadButton source={this.props.source} />
      <div>username: {firstResult.owner.login}</div>
      <div>description: {firstResult.description}</div>
      <div>url: {firstResult.html_url}</div>
    </div>
  }

  _onChange() {
    console.log("GistApp._onChange()");
    this.setState(this.getGistState());
  }
}

module.exports = GistApp
