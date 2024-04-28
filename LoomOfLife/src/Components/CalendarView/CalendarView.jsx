import { invoke } from "@tauri-apps/api/tauri";
import "./CalendarView.css";
import SearchBar from "./SearchBar";
import DailyEntry from "./DailyEntry/DailyEntry";

function CalendarView() {

  let dailyEntrys = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

  return (
    <div className="CalendarView">
      <SearchBar />

      <div className="CalendarView_scrollSection">
        {dailyEntrys.map((entry) => {
          return <DailyEntry />
        })}
      </div>
    </div>
  );
}
  
export default CalendarView;