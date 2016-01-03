import AppDispatcher from '../dispatcher/AppDispatcher';
import GistActions from '../actions/GistActions'
import GistConstants from '../constants/GistConstants';
import makeCancelable from '../utils/makeCancelable'

import $ from 'jquery'

const EventEmitter = require('events').EventEmitter;

const CHANGE_EVENT = 'change';

class GistStore extends EventEmitter {
  constructor() {
    super();
    this.state = GistConstants.STATE_INIT;
    this.url = null;
    this.result = null;
  }

  isLoading() {
    return (this.state === GistConstants.STATE_INIT
            || this.state === GistConstants.STATE_LOADING);
  }

  getLoadingUrl() {
    return this.url;
  }

  getResult() {
    return this.result;
  }
  
  startLoading(url) {
    console.log(`GistStore.startLoading(${url})`);
    this.state = GistConstants.STATE_LOADING;
    this.url = url;
    this.result = null;

    let promise = $.get(url);
    this.loader = makeCancelable(promise);
    this.loader.promise.then((result) => {
      GistActions.finishLoading(result);
    }).catch((reason) => {
      console.log(`isCanceled(${reason})`)
    });
    this.emit(CHANGE_EVENT);
  }

  finishLoading(result) {
    console.log(`GistStore.finishLoading()`);
    this.state = GistConstants.STATE_LOADED;
    this.url = null;
    this.result = result;
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

var gs = new GistStore();

AppDispatcher.register(function(action) {
  // console.log(`action: ${JSON.stringify(action, null, ' ')}`);
  console.log(`AppDispatcher.action()`);
  switch(action.actionType) {
    case GistConstants.ACTION_START_LOADING:
      gs.startLoading(action.url);
      break;
    case GistConstants.ACTION_FINISH_LOADING:
      gs.finishLoading(action.result);
      break;
  }
});

module.exports = gs;
