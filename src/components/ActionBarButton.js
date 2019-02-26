import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'grommet'
import { setCurrentScreen } from '../redux/actions/app'

const ActionBarButton = ({ app, dispatch, icon, screen }) => {
  const { currentScreen } = app
  const Icon = icon
  return (
    <Button
      icon={<Icon color={currentScreen === screen && 'brand'} />}
      onClick={() => dispatch(setCurrentScreen(screen))}
      style={{ padding: '0' }}
    />
  )
}

ActionBarButton.propTypes = {
  app: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  icon: PropTypes.func.isRequired,
  screen: PropTypes.string.isRequired
}

const mapStateToProps = ({ app }) => ({ app })

export default connect(mapStateToProps)(ActionBarButton)