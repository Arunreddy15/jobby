import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsSearch, BsFillBriefcaseFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {HiLocationMarker} from 'react-icons/hi'

import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const jwtToken = Cookies.get('jwt_token')

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const profileConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiConstants.initial,
    jobsData: [],
    profileStatus: profileConstants.initial,
    profileData: {},
    salaryRange: 0,
    employementType: [],
  }

  componentDidMount() {
    this.getJobs()
    this.getProfileData()
  }

  onClickRetryProfile = () => {
    this.getProfileData()
  }

  onClickRetryData = () => {
    this.getJobs()
  }

  onChangeSalaryRange = event => {
    const {target} = event
    const {value} = target
    this.setState({salaryRange: parseInt(value, 10)}, this.getJobs())
    console.log(event.target.value)
  }

  onChangeType = event => {
    console.log(event.target.value)
  }

  getProfileData = async () => {
    this.setState({profileStatus: profileConstants.inProgress})
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch('https://apis.ccbp.in/profile', options)
    const fetchedProfileData = await response.json()
    const formattedData = {
      name: fetchedProfileData.profile_details.name,
      profileImageUrl: fetchedProfileData.profile_details.profile_image_url,
      shortBio: fetchedProfileData.profile_details.short_bio,
    }
    console.log(fetchedProfileData)
    if (response.ok === true) {
      this.setState({
        profileStatus: profileConstants.success,
        profileData: formattedData,
      })
    } else {
      this.setState({profileStatus: profileConstants.failure})
    }
  }

  getJobs = async () => {
    const {salaryRange} = this.state
    this.setState({apiStatus: apiConstants.inProgress})
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(
      `https://apis.ccbp.in/jobs?minimum_package=${salaryRange}`,
      options,
    )
    const fetchedData = await response.json()
    const formatFetchedData = fetchedData.jobs.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      jobDescription: each.job_description,
      location: each.location,
      packagePerAnnum: each.package_per_annum,
      rating: each.rating,
      title: each.title,
    }))
    if (response.ok) {
      this.setState({
        apiStatus: apiConstants.success,
        jobsData: formatFetchedData,
      })

      console.log(formatFetchedData)
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderJobsBodyContent = () => (
    <div className="jobs-container">
      <div className="container-data">
        <div className="left-section">
          <div className="left-section-data">
            <div className="search-container-mobile">
              <input
                type="search"
                className="search-box"
                placeholder="Search"
                id="search"
              />
              <BsSearch size={26} className="search-icon" htmlFor="search" />
            </div>
            <div className="profile-data-container">
              {this.renderResponseProfileData()}
            </div>
            <div>
              <hr />
              <p className="filter-heading">Type of Employment</p>
              <ul className="unordered-list">
                {employmentTypesList.map(each => (
                  <li key={each.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={each.employmentTypeId}
                      value={each.employmentTypeId}
                      onChange={this.onChangeType}
                    />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <hr />
              <p className="filter-heading">Salary Range</p>
              <ul className="unordered-list">
                {salaryRangesList.map(each => (
                  <li key={each.salaryRangeId}>
                    <input
                      type="radio"
                      name="salary-range"
                      id={each.salaryRangeId}
                      value={each.salaryRangeId}
                      onChange={this.onChangeSalaryRange}
                    />
                    <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="right-section">
          <div className="right-section-data">
            <div className="search-container">
              <input
                type="search"
                className="search-box"
                placeholder="Search"
                id="search"
              />
              <BsSearch size={26} className="search-icon" htmlFor="search" />
            </div>
            <div>{this.renderResponseData()}</div>
          </div>
        </div>
      </div>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#fff" height="50" width="50" />
    </div>
  )

  renderDataFailureView = () => (
    <div className="container-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page your looking for
      </p>
      <button
        type="button"
        className="retry-right-sec"
        onClick={this.onClickRetryData}
      >
        Retry
      </button>
    </div>
  )

  renderFetchedJobData = () => {
    const {jobsData} = this.state
    return (
      <ul className="jobs-list-container">
        {jobsData.map(each => (
          <Link to="/" className="nav-link">
            <li>
              <div className="item-container">
                <div className="item-top-part">
                  <img
                    src={each.companyLogoUrl}
                    alt="name"
                    className="company-logo"
                  />
                  <div>
                    <h1 className="job-title">{each.title}</h1>
                    <div className="job-rating-container">
                      <FaStar className="rating-icon" />
                      <p className="job-rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="item-middle-part">
                  <div className="middle-part-location-and-type">
                    <div className="location-container">
                      <HiLocationMarker size={24} className="location-icon" />
                      <p className="job-location">{each.location}</p>
                    </div>
                    <div className="employmentType-container">
                      <BsFillBriefcaseFill
                        size={24}
                        className="briefcase-icon"
                      />
                      <p className="job-emptype">{each.employmentType}</p>
                    </div>
                  </div>
                  <p className="job-salary">{each.packagePerAnnum}</p>
                </div>
                <hr />
                <div className="item-bottom-part">
                  <h1 className="job-description-head">Description</h1>
                  <p className="job-description">{each.jobDescription}</p>
                </div>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  renderResponseData = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderFetchedJobData()
      // return 'success'
      case apiConstants.failure:
        return this.renderDataFailureView()
      case apiConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfileData = () => {
    const {profileData} = this.state
    const {name, shortBio, profileImageUrl} = profileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt={name} className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileLoadingView = () => (
    <div className="profile-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#fff" height="50" width="50" />
    </div>
  )

  renderProfileDataFailureView = () => (
    <button
      type="button"
      className="profile-retry-btn"
      onClick={this.onClickRetryProfile}
    >
      Retry
    </button>
  )

  renderResponseProfileData = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case profileConstants.success:
        return this.renderProfileData()
      case profileConstants.failure:
        return this.renderProfileDataFailureView()
      case profileConstants.inProgress:
        return this.renderProfileLoadingView()
      default:
        return null
    }
  }

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
