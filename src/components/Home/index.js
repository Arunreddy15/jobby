import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import './index.css'

const Home = props => {
  const {history} = props
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    history.replace('/login')
  }

  return (
    <div className="home-container">
      <div className="home">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs salary, information, company
          reviews.Find the job that fit your abilities and potentials.
        </p>
        <Link to="/jobs">
          <button type="button" className="bnt-home">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home
