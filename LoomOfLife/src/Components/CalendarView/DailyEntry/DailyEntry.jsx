import { exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import "./DailyEntry.css";
import TasksSection from "./TasksSection.jsx";
import TracksSection from "./TracksSection.jsx";
import HabitSection from "./HabitsSection.jsx";
import StatusSection from "./StatusSection.jsx";
import DiarySection from "./DiarySection.jsx";
import DateDisplay from "./DateDisplay.jsx";
import { convertDateToFileName, convertDateToString, getPastNowOrFuture, parseTagContents } from "../../Helper.js";
import { useContext, useEffect, useState } from "react";
import { VaultContext } from "../CalendarView.jsx";
import { useDebouncedCallback } from 'use-debounce';

function DailyEntry({date}) {
  const fileName = convertDateToFileName(date);
  const [vaultPath,setVaultPath] = useContext(VaultContext);
  const filePath = `${vaultPath}\\${fileName}`;
  const pastNowOrFuture = getPastNowOrFuture(date);
  const [fileExists, setFileExists] = useState(false);
  const [parsedContents, setParsedContents] = useState({});

  //Boolean that is set by the editing function to update the parsed contents
  const [reparseContents, setReparseContents] = useState(false);

  // Check if file exists
  useEffect(()=>{
    const checkFileExists = async () => {
      const output = await exists(filePath);
      setFileExists(output);
    }
    checkFileExists();
  }, [date, vaultPath]);

  // Parsing contents once file exists
  useEffect(()=>{
    const readFileContents = async () => {
      if (!fileExists){
        return;
      }

      const output = await readTextFile(filePath)
        .catch(err => {console.log(err)});
      
      //console.log(output);

      const tagsToMatch = ["Habits", "Tracks", "Tasks", "Status", "Diary"]

      let parseDict = tagsToMatch.reduce((acc,el) => {
        acc[el] = parseTagContents(output, el);
        return acc;
      }, {});

      setParsedContents(parseDict);
    }
    
    readFileContents();
  }, [fileExists, vaultPath, reparseContents]);

  //Editing information for each section
  const editFileContents = useDebouncedCallback(async (editTag, newContent) => {
    if (!fileExists){
      return; 
    }

    const tagsToMatch = ["Habits", "Tracks", "Tasks", "Status", "Diary"]

    let editedContent = tagsToMatch.reduce((acc,el)=>{
      acc += `\n\n<${el}>\n`;
      if (el == editTag){
        acc += `${newContent}`;
      } else{
        acc += parsedContents[el];
      }
      acc += `\n</${el}>`;
      return acc
    }, convertDateToString(date));

    await writeTextFile({ 
      path: filePath, 
      contents: editedContent
    }).catch(err => {console.log(err)});

    setReparseContents(!reparseContents);
  }, 500)

  return (
    <div className="DailyEntry_row">
      <DateDisplay date={date}/>

      {!fileExists?
      <div>No entry</div>
      :Object.keys(parsedContents).length === 0
      ?<div>Loading...</div>
      :
      <div className="DailyEntry_column">
        <TasksSection 
          isEmptyFile={false}
          canEdit={pastNowOrFuture!="Past"}
          contents={parsedContents.Tasks}
          editFileFunc={editFileContents}/>
        {!(pastNowOrFuture=="Future") && <>
        <HabitSection contents={parsedContents.Habits}/>
        <TracksSection contents={parsedContents.Tracks}/>
        <StatusSection 
          canEdit={pastNowOrFuture=="Now"}
          contents={parsedContents.Status}
          editFileFunc={editFileContents}/>
        <DiarySection 
          canEdit={pastNowOrFuture=="Now"}
          contents={parsedContents.Diary} 
          editFileFunc={editFileContents}/>
          </>}
      </div>
      }
    </div>
  );
}

export default DailyEntry;