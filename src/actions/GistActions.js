
var AppDispatcher = require('../dispatcher/AppDispatcher');
var GistConstants = require('../constants/GistConstants');

class GistActions {
  startLoading(url) {
    console.log(`GistActions.startLoading(${url})`)
    AppDispatcher.dispatch({
      actionType: GistConstants.ACTION_START_LOADING,
      url: url
    });
  }
  finishLoading(result) {
    console.log(`GistActions.finishLoading()`);
    AppDispatcher.dispatch({
      actionType: GistConstants.ACTION_FINISH_LOADING,
      result: result
    });
  }
}

module.exports = new GistActions();
