import {Link} from 'react-router-dom'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {HiLocationMarker} from 'react-icons/hi'
import {FaStar} from 'react-icons/fa'

const JobItem = props => {
  const {itemData} = props
  const {
    id,
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = itemData

  return (
    <Link to={`/jobs/${id}`} className="nav-link">
      <li>
        <div className="item-container">
          <div className="item-top-part">
            <img src={companyLogoUrl} alt="name" className="company-logo" />
            <div>
              <h1 className="job-title">{title}</h1>
              <div className="job-rating-container">
                <FaStar className="rating-icon" />
                <p className="job-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="item-middle-part">
            <div className="middle-part-location-and-type">
              <div className="location-container">
                <HiLocationMarker size={24} className="location-icon" />
                <p className="job-location">{location}</p>
              </div>
              <div className="employmentType-container">
                <BsFillBriefcaseFill size={24} className="briefcase-icon" />
                <p className="job-emptype">{employmentType}</p>
              </div>
            </div>
            <p className="job-salary">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="item-bottom-part">
            <h1 className="job-description-head">Description</h1>
            <p className="job-description">{jobDescription}</p>
          </div>
        </div>
      </li>
    </Link>
  )
}
export default JobItem
