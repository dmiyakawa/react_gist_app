import GistApp from './components/GistApp.react'
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <GistApp source="https://api.github.com/users/dmiyakawa/gists" />,
  document.getElementById('gistapp')
);
