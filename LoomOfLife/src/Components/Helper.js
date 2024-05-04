import dayjs from "dayjs";

export const getMonday = (input) => {
    return (input.day() == 0)?input.startOf('week').subtract(6,'day'):input.startOf('week').add(1,'day');
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

export const parseTagContents = (contents, tag) => {
    let regex = new RegExp(`(?<=\<${tag}\>)(.*)(?=\<\/${tag}\>)`, "ms");

    let matches = contents.match(regex);

    if (matches){
        return matches[0].trim();
    }else {
        return null;
    }
}

export const replaceTagContents = (oldContents, newContents, tag) => {
    let regex = new RegExp(`(?<=\<${tag}\>)(.*)(?=\<\/${tag}\>)`, "ms");

    let matches = oldContents.match(regex);

    if (matches){
        return oldContents.replace(regex, newContents);
    }else {
        return oldContents + `\n\n<${tag}>${newContents}</${tag}>`;
    }

    
}