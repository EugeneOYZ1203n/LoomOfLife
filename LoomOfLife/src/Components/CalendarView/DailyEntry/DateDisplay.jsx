import { invoke } from "@tauri-apps/api/tauri";
import dayjs from "dayjs";
import "./DateDisplay.css";

function DateDisplay({date}) {
  let dayOfWeek = date.format('ddd');
  let fullDate = date.format('DD MMM');
  
  return (
    <div className={`DateDisplay ${date.isSame(dayjs(), 'day')?"DateDisplay_Emphasis":""}`}>
      <div className="DateDisplay_DayOfWeek">{dayOfWeek}</div>
      <div className="DateDisplay_FullDate">{fullDate}</div>
    </div>
  );
}

export default DateDisplay;