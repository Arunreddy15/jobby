import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const api = 'https://apis.ccbp.in/jobs'
const jwtToken = Cookies.get('jwt_token')

class Jobs extends Component {
  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    const options = {
      method: 'GET',
      Authorization: `Bearer ${jwtToken}`,
    }
    // console.log(options.Authorization)
    const response = await fetch(api, options)
    // const data = await response.json()
    console.log(response.ok)
  }

  renderJobsBodyContent = () => (
    <div className="jobs-container">
      <div className="container-data">
        <div className="left-section">
          <h1>Profile</h1>
        </div>
        <div className="right-section">
          <div className="search-container">
            <input
              type="search"
              className="search-box"
              placeholder="Search"
              id="search"
            />
            <BsSearch size={26} className="search-icon" htmlFor="search" />
          </div>
        </div>
      </div>
    </div>
  )

  render() {
    const {history} = this.props

    if (jwtToken === undefined) {
      history.replace('/login')
    }
    return (
      <div>
        <Header />
        {this.renderJobsBodyContent()}
      </div>
    )
  }
}
export default Jobs
