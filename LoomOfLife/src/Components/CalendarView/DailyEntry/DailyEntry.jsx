import { invoke } from "@tauri-apps/api/tauri";
import "./DailyEntry.css";
import TasksSection from "./TasksSection.jsx";
import HabitSection from "./HabitsSection.jsx";
import NotesSection from "./NotesSection.jsx";
import StatusSection from "./StatusSection.jsx";
import DiarySection from "./DiarySection.jsx";
import DateDisplay from "./DateDisplay.jsx";
import CoreHabitThreads from "./CoreHabitThreads.jsx";

function DailyEntry() {
  return (
    <div className="DailyEntry_row">
      <DateDisplay />
      
      <CoreHabitThreads />

      <div className="DailyEntry_column">
        <HabitSection />
        <TasksSection />
        <NotesSection />
      </div>

      <div className="DailyEntry_column">
        <StatusSection />
        <DiarySection />
      </div>
    </div>
  );
}

export default DailyEntry;