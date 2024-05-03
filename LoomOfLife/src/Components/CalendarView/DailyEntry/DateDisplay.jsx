import { invoke } from "@tauri-apps/api/tauri";
import "./DateDisplay.css";

function DateDisplay({date}) {
  let dayOfWeek = date.format('ddd');
  let fullDate = date.format('DD MMM');
  
  return (
    <div className="DateDisplay">
      <div className="DateDisplay_DayOfWeek">{dayOfWeek}</div>
      <div className="DateDisplay_FullDate">{fullDate}</div>
    </div>
  );
}

export default DateDisplay;