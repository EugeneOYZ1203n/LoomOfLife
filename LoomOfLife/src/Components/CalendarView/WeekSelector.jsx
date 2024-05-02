import { invoke } from "@tauri-apps/api/tauri";
import "./WeekSelector.css";
import { useContext } from "react";
import { SelectedMondayContext } from "./CalendarView";
import { getWeekString } from "../Helper";

function WeekSelector() {

    const [selectedMonday, setSelectedMonday] = useContext(SelectedMondayContext);
    
    const shiftWeek = (diff) => {
        setSelectedMonday(selectedMonday.add(diff * 7, 'day'));
    }
  
    return (
        <div className="WeekSelector_Row">
            <button onClick={()=>shiftWeek(-52)}>{"<y"}</button>
            <button onClick={()=>shiftWeek(-4)}>{"<m"}</button>
            <button onClick={()=>shiftWeek(-1)}>{"<"}</button>
            <p>{getWeekString(selectedMonday)}</p>
            <button onClick={()=>shiftWeek(1)}>{">"}</button>
            <button onClick={()=>shiftWeek(4)}>{"m>"}</button>
            <button onClick={()=>shiftWeek(52)}>{"y>"}</button>
        </div>
    );
}

export default WeekSelector;