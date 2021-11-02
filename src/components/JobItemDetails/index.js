import {Component} from 'react'
import Cookies from 'js-cookie'

import {FaStar} from 'react-icons/fa'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {HiLocationMarker} from 'react-icons/hi'
import {GoLinkExternal} from 'react-icons/go'
import Loader from 'react-loader-spinner'
import './index.css'

const jwtToken = Cookies.get('jwt_token')
const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class JobItemDetails extends Component {
  state = {jobItemDetails: {}, apiStatus: apiConstants.initial}

  componentDidMount() {
    this.getJobDetails()
  }

  onClickRetryData = () => {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const api = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(api, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const fetchedData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          jobDescription: data.job_details.job_description,
          location: data.job_details.location,
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          skills: data.job_details.skills.map(each => ({
            name: each.name,
            imageUrl: each.image_url,
          })),
          title: data.job_details.title,
          id: data.job_details.id,
        },
        similarJobs: data.similar_jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          jobDescription: each.job_description,
          location: each.location,
          rating: each.rating,
          title: each.title,
          id: each.id,
        })),
      }
      this.setState({
        jobItemDetails: fetchedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
      this.renderFailureView()
    }
  }

  renderLoading = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#fff" height="50" width="50" />
    </div>
  )

  renderSimilarJobItems = () => {
    const {jobItemDetails} = this.state
    return (
      <>
        <h1 className="heading-similar-jobs">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {jobItemDetails.similarJobs.map(each => (
            <li key={each.id} className="similar-jobs-item">
              <div className="similar-item-top-part">
                <img
                  src={each.companyLogoUrl}
                  alt="similar job company logo"
                  className="similar-logo"
                />
                <div className="similar-item-top-heading-con">
                  <h1 className="job-role-heading">{each.title}</h1>
                  <div className="similar-rating-container">
                    <FaStar className="rating-icon" />
                    <p className="similar-rating">{each.rating}</p>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="description-heading">Description</h1>
                <p className="description">{each.jobDescription}</p>
              </div>
              <div className="similar-bottom-part-location-and-type">
                <div className="similar-location-container">
                  <HiLocationMarker
                    size={18}
                    className="similar-location-icon"
                  />
                  <p className="similar-job-location">{each.location}</p>
                </div>
                <div className="similar-employmentType-container">
                  <BsFillBriefcaseFill
                    size={18}
                    className="similar-briefcase-icon"
                  />
                  <p className="similar-job-emptype">{each.employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderJobDetails = () => {
    const {jobItemDetails} = this.state
    console.log(jobItemDetails.jobDetails.skills)
    const {skills, lifeAtCompany} = jobItemDetails.jobDetails
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
    } = jobItemDetails.jobDetails
    console.log(companyLogoUrl)
    return (
      <div className="data-container">
        <div className="job-details-container">
          <div className="item-top-part">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo-details"
            />
            <div>
              <h1 className="job-title-details">{title}</h1>
              <div className="job-rating-container">
                <FaStar className="rating-icon" />
                <p className="job-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-type-salary">
            <div className="location-type">
              <div className="location">
                <HiLocationMarker size={26} className="location-icon" />
                <p>{location}</p>
              </div>
              <div className="employment">
                <BsFillBriefcaseFill size={26} className="location-icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div>
            <div className="desc-heading-visit-link-box">
              <h1 className="heading">Description</h1>
              <div className="visit-link-site">
                <a href={companyWebsiteUrl}>Visit</a>
                <GoLinkExternal size={18} className="visit-icon" />
              </div>
            </div>
            <p className="description-job">{jobDescription}</p>
          </div>
          <div>
            <h1 className="skills-heading">Skills</h1>
            <ul className="skills-container">
              {skills.map(each => (
                <li className="skill-item" key={each.id}>
                  <img
                    src={each.imageUrl}
                    alt={each.name}
                    className="skill-logo"
                  />
                  <p>{each.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1 className="heading">Life at Company</h1>
            <div className="life-at-company-container">
              <p className="description-life-at-company">
                {lifeAtCompany.description}
              </p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="life-at-company-image"
              />
            </div>
          </div>
        </div>
        {this.renderSimilarJobItems()}
      </div>
    )
  }

  renderFailureView = () => (
    <div className="container-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
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

  renderResponseData = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderJobDetails()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    return <div className="details-info-page">{this.renderResponseData()}</div>
  }
}
export default JobItemDetails
