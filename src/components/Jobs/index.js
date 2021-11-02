import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import JobItem from '../JobItem'
import FiltersGroup from '../FiltersGroup'
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
  noData: 'NO_DATA',
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
    searchInput: '',
    employmentType: [],
  }

  componentDidMount() {
    this.getJobs()
    this.getProfileData()
  }

  onChangeInput = event => {
    if (event.target.value === '') {
      this.getJobs()
    }
    this.setState({searchInput: event.target.value})
  }

  onClickRetryProfile = () => {
    this.getProfileData()
  }

  onClickRetryData = () => {
    this.getJobs()
  }

  onChangeSalaryRange = salaryRangeId => {
    this.setState({salaryRange: salaryRangeId}, this.getJobs)
  }

  onChangeType = type => {
    this.setState(
      prevState => ({
        employmentType: [...prevState.employmentType, type],
      }),
      this.getJobs,
    )
  }

  getProfileData = async () => {
    this.setState({profileStatus: profileConstants.inProgress})
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch('https://apis.ccbp.in/profile', options)
    const fetchedProfileData = await response.json()

    if (response.ok === true) {
      const profileData = fetchedProfileData.profile_details

      const formattedData = {
        profileName: profileData.name,
        profileImageUrl: profileData.profile_image_url,
        shortBio: profileData.short_bio,
      }
      this.setState({
        profileStatus: profileConstants.success,
        profileData: formattedData,
      })
    } else {
      this.setState({profileStatus: profileConstants.failure})
    }
  }

  getJobs = async () => {
    const {salaryRange, searchInput, employmentType} = this.state
    this.setState({apiStatus: apiConstants.inProgress})
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${employmentType}&search=${searchInput}&minimum_package=${salaryRange}`,
      options,
    )
    const fetchedData = await response.json()
    console.log(fetchedData)
    if (response.ok === true) {
      const formatFetchedData = fetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
        id: each.id,
      }))

      this.setState({
        apiStatus: apiConstants.success,
        jobsData: formatFetchedData,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onSearchBtn = () => {
    this.getJobs()
  }

  onEnterSearch = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  renderJobsBodyContent = () => {
    const {searchInput} = this.state

    return (
      <div className="jobs-container">
        <div className="container-data">
          <div className="left-section">
            <div className="left-section-data">
              <div className="search-container-mobile">
                <input
                  value={searchInput}
                  type="search"
                  className="search-box"
                  placeholder="Search"
                  onChange={this.onChangeInput}
                  onKeyDown={this.onEnterSearch}
                />
                <button
                  type="button"
                  onClick={this.onSearchBtn}
                  className="searchBtn"
                  testid="searchButton"
                >
                  <BsSearch size={20} className="search-icon" />
                </button>
              </div>
              <div className="profile-data-container">
                {this.renderResponseProfileData()}
              </div>
              <FiltersGroup
                employmentTypesList={employmentTypesList}
                onChangeType={this.onChangeType}
                salaryRangesList={salaryRangesList}
                onChangeSalaryRange={this.onChangeSalaryRange}
              />
            </div>
          </div>
          <div className="right-section">
            <div className="right-section-data">
              <div className="search-container">
                <input
                  value={searchInput}
                  type="search"
                  className="search-box"
                  placeholder="Search"
                  onChange={this.onChangeInput}
                />
                <button
                  type="button"
                  className="searchBtn"
                  onClick={this.onSearchBtn}
                  testid="searchButton"
                >
                  <BsSearch size={26} className="search-icon" />
                </button>
              </div>
              <div>{this.renderResponseData()}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
        className="failure-image-data"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
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
    const jobsInTheData = jobsData.length === 0

    return jobsInTheData ? (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-des">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    ) : (
      <ul className="jobs-list-container">
        {jobsData.map(each => (
          <JobItem itemData={each} key={each.id} />
        ))}
      </ul>
    )
  }

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-des">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderResponseData = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderFetchedJobData()
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
    const {profileName, shortBio, profileImageUrl} = profileData
    // console.log(profileName)
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{profileName}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileLoadingView = () => (
    <div className="profile-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#fff" height="50" width="50" />
    </div>
  )

  renderProfileDataFailure = () => (
    // <div className="retry-container">
    <button
      type="button"
      className="profile-retry-btn"
      onClick={this.onClickRetryProfile}
    >
      Retry
    </button>
    // </div>
  )

  renderResponseProfileData = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case profileConstants.success:
        return this.renderProfileData()
      case profileConstants.failure:
        return this.renderProfileDataFailure()
      case profileConstants.inProgress:
        return this.renderProfileLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderJobsBodyContent()}</div>
  }
}
export default Jobs
