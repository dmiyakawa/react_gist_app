"use strict";

import React from 'react'
import $ from 'jquery'
import makeCancelable from '../utils/makeCancelable'

import GistStore from '../stores/GistStore'

class GistList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (GistStore.isLoading()) {
      return <div>loading {GistStore.getLoadingUrl()}</div>
    }
    let result = GistStore.getResult();
    console.log(`result: ${JSON.stringify(result, null, ' ')}`);
    let uls = result.map((elem) => {
      console.log(elem);
      return <li>{elem.description}</li>
    });
    return <div><ul>{uls}</ul></div>;
  }
}

module.exports = GistList
