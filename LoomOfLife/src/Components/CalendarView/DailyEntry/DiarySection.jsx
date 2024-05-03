import { invoke } from "@tauri-apps/api/tauri";
import "./DiarySection.css";
import { useState } from "react";

function DiarySection({contents, editFileFunc}) {
  const [contentText, setContentText] = useState(contents);

  return (
    <div>
      <textarea 
        onChange={(e)=>{
          setContentText(e.target.value);
          editFileFunc("Diary", e.target.value);
        }}
        value = {contentText}>
      </textarea>
    </div>
  );
}

export default DiarySection;