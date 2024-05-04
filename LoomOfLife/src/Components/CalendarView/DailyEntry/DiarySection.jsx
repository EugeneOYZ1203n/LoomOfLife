import { invoke } from "@tauri-apps/api/tauri";
import "./DiarySection.css";
import { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';

function DiarySection({canEdit, contents, editFileFunc}) {
  const [contentText, setContentText] = useState(contents?contents:"");

  return (
    <div className="DiarySection">
      {canEdit?
      <TextareaAutosize
        className="DiarySection_Text"
        onChange={(e)=>{
          setContentText(e.target.value);
          editFileFunc("Diary", e.target.value);
        }}
        value = {contentText} />
      :
      <p className="DiarySection_Text">
        {contentText}
      </p>
      }
    </div>
  );
}

export default DiarySection;