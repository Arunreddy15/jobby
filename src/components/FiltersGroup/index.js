import './index.css'

const FiltersGroup = props => {
  const renderEmployment = () => {
    const {employmentTypesList} = props
    // const {label, employmentTypeId} = employmentTypesList

    return (
      <div>
        <hr />
        <h1 className="filter-heading">Type of Employment</h1>
        <ul className="unordered-list">
          {employmentTypesList.map(each => (
            <li key={each.employmentTypeId}>
              <input
                type="checkbox"
                id={each.employmentTypeId}
                value={each.employmentTypeId}
                className="employment-type"
                // onChange={onChangeTypeSal}
              />
              <label htmlFor={each.employmentTypeId} className="emp-label">
                {each.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  /* const onChangeTypeSal = onChangeType(each.employmentTypeId) */
  const renderSalaryFilter = () => {
    const {salaryRangesList, onChangeSalaryRange} = props
    return (
      <div>
        <hr />
        <h1 className="filter-heading">Salary Range</h1>
        <ul className="unordered-list">
          {salaryRangesList.map(each => {
            const onChangeSalary = () => onChangeSalaryRange(each.salaryRangeId)
            return (
              <li key={each.salaryRangeId}>
                <input
                  type="radio"
                  name="salary-range"
                  id={each.salaryRangeId}
                  value={each.salaryRangeId}
                  onChange={onChangeSalary}
                  className="salary"
                />
                <label htmlFor={each.salaryRangeId} className="salary-label">
                  {each.label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <>
      {renderEmployment()}
      {renderSalaryFilter()}
    </>
  )
}
export default FiltersGroup
