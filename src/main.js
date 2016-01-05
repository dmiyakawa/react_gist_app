import GistApp from './components/GistApp.react'
import React from 'react'
import ReactDOM from 'react-dom'

class Main {
  run(gist_url) {
    console.log("Main.run()");
    ReactDOM.render(
      <GistApp source={gist_url} />,
      document.getElementById('gistapp')
    );
  }
}

module.exports = new Main();
