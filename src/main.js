import GistApp from './components/GistApp.react'
import React from 'react'
import ReactDOM from 'react-dom'

class Main {
  run() {
    ReactDOM.render(
      <GistApp source="https://api.github.com/users/dmiyakawa/gists" />,
      document.getElementById('gistapp')
    );
  }
}

module.exports = new Main();
