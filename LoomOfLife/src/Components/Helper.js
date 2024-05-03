import dayjs from "dayjs";

export const getMonday = (input) => {
    return input.startOf('week').add(1,'day');
}

export const convertDateToString = (dayJSObj) => {
    return dayJSObj.format('DD MMM YY');
}

export const convertDateToFileName = (dayJSObj) => {
    return dayJSObj.format('DD_MMM_YYYY.txt');
}

export const getWeekString = (mondayDayJSObj) => {
    let sundayDayJSObj = mondayDayJSObj.add(6,'day');
    return convertDateToString(mondayDayJSObj)
         + " - " 
         + convertDateToString(sundayDayJSObj);
}

export const zeroPad = (num, places) => String(num).padStart(places, '0')

export const getPastNowOrFuture = (date) => {
    let diff = date.diff(dayjs(), 'hour');
    return -30 < diff && diff < 1?
        "Now"
    :date.isBefore(dayjs(),'day')?
        "Past"
    :
        "Future"
    }