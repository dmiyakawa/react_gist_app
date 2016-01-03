"use strict";

import React from 'react'
import GistActions from '../actions/GistActions'

class ReloadButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("ReloadButton.render()");
    return <div>
      <a className="btn btn-primary"
      onClick={() => {GistActions.startLoading(this.props.source)}}>Reload</a>
    </div>
  }
}

module.exports = ReloadButton
