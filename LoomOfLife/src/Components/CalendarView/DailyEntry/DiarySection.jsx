import { invoke } from "@tauri-apps/api/tauri";
import "./DiarySection.css";

function DiarySection({contents}) {
  return (
    <div>
      {contents}
    </div>
  );
}

export default DiarySection;