import { invoke } from "@tauri-apps/api/tauri";
import "./DiarySection.css";
import { useState } from "react";

function DiarySection({canEdit, contents, editFileFunc}) {
  const [contentText, setContentText] = useState(contents?contents:"");

  console.log({contentText})

  return (
    <div className="DiarySection">
      {canEdit?
      <textarea 
        className="DiarySection_Text"
        onChange={(e)=>{
          setContentText(e.target.value);
          editFileFunc("Diary", e.target.value);
        }}
        value = {contentText}>
      </textarea>
      :
      <p className="DiarySection_Text">
        {contentText}
      </p>
      }
    </div>
  );
}

export default DiarySection;