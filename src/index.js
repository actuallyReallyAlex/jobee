import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux/store/store'
import './firebase/init'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Grommet, grommet } from 'grommet'

ReactDOM.render(
  <Provider store={store}>
    <Grommet full theme={grommet}>
      <App />
    </Grommet>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
