import { invoke } from "@tauri-apps/api/tauri";
import { exists, readTextFile } from "@tauri-apps/api/fs";
import "./DailyEntry.css";
import TasksSection from "./TasksSection.jsx";
import TracksSection from "./TracksSection.jsx";
import HabitSection from "./HabitsSection.jsx";
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
  const [parsedContents, setParsedContents] = useState({});

  // Check if file exists
  useEffect(()=>{
    const checkFileExists = async () => {
      const output = await exists(filePath);
      setFileExists(output);
    }
    checkFileExists();
  }, [date, vaultPath]);

  // If exists, read the file on UseEffect with date dependency
  useEffect(()=>{
    const parseFileContents = (contents, tag) => {
      let regex = new RegExp(`(?<=\<${tag}\>)(.*)(?=\<\/${tag}\>)`, "ms");

      let matches = contents.match(regex);

      if (matches){
        return matches[0].trim();
      }else {
        return null;
      }
    }

    const readFileContents = async () => {
      if (!fileExists){
        return;
      }

      const output = await readTextFile(filePath)
        .catch(err => {console.log(err)});
      
      console.log(output);

      const tagsToMatch = ["Habits", "Tracks", "Tasks", "Status", "Diary"]

      let parseDict = tagsToMatch.reduce((acc,el) => {
        acc[el] = parseFileContents(output, el);
        return acc;
      }, {});

      setParsedContents(parseDict);
    }
    
    readFileContents();
  }, [fileExists, vaultPath]);

  return (
    <div className="DailyEntry_row">
      <DateDisplay date={date}/>
      
      <CoreHabitThreads />

      {!fileExists
      ?<div>No entry</div>
      :Object.keys(parsedContents).length === 0
      ?<div>Loading...</div>
      :
      <>
        <div className="DailyEntry_column">
          <HabitSection contents={parsedContents.Habits}/>
          <TracksSection contents={parsedContents.Tracks}/>
          <TasksSection contents={parsedContents.Tasks}/>
        </div>

        <div className="DailyEntry_column">
          <StatusSection contents={parsedContents.Status}/>
          <DiarySection contents={parsedContents.Diary}/>
        </div>
      </>
      }
    </div>
  );
}

export default DailyEntry;