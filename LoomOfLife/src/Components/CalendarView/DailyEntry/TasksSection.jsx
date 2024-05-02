import { invoke } from "@tauri-apps/api/tauri";
import "./TasksSection.css";

function TasksSection({contents}) {
  return (
    <div>
      {contents}
    </div>
  );
}

export default TasksSection;