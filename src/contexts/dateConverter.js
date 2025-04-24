export function dateConvert(date) {
    let parts = date.split('-')
    let year = parts[0]
    let month = parts[1]
    let day = parts[2]
  
    let convertedDate = day + '/' + month + '/' + year
    return convertedDate
  }

  export function dateConvertSearch(date) {
    let newDate = dateConvertYYYYMMDD(date)

    let parts = newDate.split('-')
    let year = parts[0]
    let month = parts[1]
    let day = parts[2]
  
    let convertedDate = day + '-' + month + '-' + year
    return convertedDate
  }

  export function dateConvertYYYYMMDD(date){
    return date.toISOString().split('T')[0]
  }