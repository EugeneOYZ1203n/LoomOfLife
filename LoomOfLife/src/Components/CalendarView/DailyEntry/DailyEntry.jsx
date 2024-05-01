import { invoke } from "@tauri-apps/api/tauri";
import { exists, readDir, readTextFile } from "@tauri-apps/api/fs";
import "./DailyEntry.css";
import TasksSection from "./TasksSection.jsx";
import HabitSection from "./HabitsSection.jsx";
import NotesSection from "./NotesSection.jsx";
import StatusSection from "./StatusSection.jsx";
import DiarySection from "./DiarySection.jsx";
import DateDisplay from "./DateDisplay.jsx";
import CoreHabitThreads from "./CoreHabitThreads.jsx";
import { convertDateToFileName } from "../../Helper.js";
import { useContext, useEffect, useState } from "react";
import { VaultContext } from "../CalendarView.jsx";

function DailyEntry({date}) {
  const fileName = convertDateToFileName(date);
  const [vaultPath,setVaultPath] = useContext(VaultContext);
  const filePath = `${vaultPath}\\${fileName}`;
  const [fileExists, setFileExists] = useState(false);


  // Check if file exists
  useEffect(()=>{
    const checkFileExists = async () => {
      const output = await exists(filePath);
      setFileExists(output);
    }
    checkFileExists();
  }, [date]);

  // If exists, read the file on UseEffect with date dependency
  useEffect(()=>{
    const readFileContents = async () => {
      if (!fileExists){
        return;
      }

      const output = await readTextFile(filePath);
      console.log(output);
    }
    readFileContents()
  }, [fileExists]);

  // Parse file using tags and pass each set of strings to respective sections
 

  return (
    <div className="DailyEntry_row">
      <DateDisplay date={date}/>
      
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