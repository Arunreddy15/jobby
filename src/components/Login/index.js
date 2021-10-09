import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  submitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  submitFailure = error => {
    this.setState({errorMsg: error, showErrorMsg: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}
    const api = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(api, options)
    const data = await response.json()
    if (response.ok === true) {
      console.log(data.jw_token)
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderFormContainer = () => {
    const {username, password, showErrorMsg, errorMsg} = this.state
    return (
      <form className="form-container" onSubmit={this.onSubmitForm}>
        <div className="input-username">
          <label htmlFor="username" className="labels">
            USERNAME
          </label>
          <br />
          <input
            type="text"
            id="username"
            value={username}
            placeholder="Username"
            onChange={this.onChangeUsername}
          />
        </div>
        <div className="input-password">
          <label htmlFor="password" className="labels">
            PASSWORD
          </label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            placeholder="Password"
            onChange={this.onChangePassword}
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
        {showErrorMsg && <p className="errorMsg">{errorMsg}</p>}
      </form>
    )
  }

  render() {
    const {history} = this.props
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      history.replace('/')
    }
    return (
      <div className="login-container">
        <div className="container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-image"
          />
          {this.renderFormContainer()}
        </div>
      </div>
    )
  }
}
export default Login
