import { invoke } from "@tauri-apps/api/tauri";
import "./DiarySection.css";
import { useState } from "react";

function DiarySection({pastNowOrFuture, contents, editFileFunc}) {
  const [contentText, setContentText] = useState(contents?contents:"");

  return (
    <div>
      {pastNowOrFuture=="Now"?
      <textarea 
        onChange={(e)=>{
          setContentText(e.target.value);
          editFileFunc("Diary", e.target.value);
        }}
        value = {contentText}>
      </textarea>
      :pastNowOrFuture=="Past"?
      <p>
        {contentText}
      </p>
      :
      <p>---</p>
      }
      
    </div>
  );
}

export default DiarySection;