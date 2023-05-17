import moment from 'moment'

import './dateRange.css'

function DateRange({ startDate, endDate }) {
  const dates = []

  let currentDate = moment(startDate)
  const stopDate = moment(endDate)

  while (currentDate <= stopDate) {
    dates.push(moment(currentDate).format('YYYY-MM-DD'))
    currentDate = moment(currentDate).add(1, 'days')
  }

  return (
    <div>
      {dates.map(date => (
        <p key={date}>{date}</p>
      ))}
    </div>
  )
}

export default DateRange;