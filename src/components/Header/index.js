import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import {Link, withRouter} from 'react-router-dom'

import './index.css'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props

    history.replace('/login')
  }

  return (
    <div className="nav-container">
      <div className="header-container">
        <Link to="/">
          <button type="button" className="logo-btn">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logo"
            />
          </button>
        </Link>
        <ul className="route-links-nonMobile">
          <Link to="/" className="nav-link">
            <li>Home</li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li>Jobs</li>
          </Link>
        </ul>
        <ul className="route-links-mobile">
          <Link to="/" className="nav-link">
            <li>
              <button type="button" className="icons">
                <AiFillHome className="home-icon" fontSize={26} />
              </button>
            </li>
          </Link>
          <Link to="/jobs" className="nav-link">
            <li>
              <button type="button" className="icons">
                <BsFillBriefcaseFill className="job-icon" fontSize={26} />
              </button>
            </li>
          </Link>
          <button
            className="logout-btn-mobile"
            type="button"
            onClick={onLogout}
          >
            <FiLogOut className="logout-icon" fontSize={26} />
          </button>
        </ul>
        <button className="logout-btn" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}
export default withRouter(Header)
