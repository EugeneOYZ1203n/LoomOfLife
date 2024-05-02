import { invoke } from "@tauri-apps/api/tauri";
import "./HabitsSection.css";

function HabitsSection({contents}) {
  return (
    <div>
      {contents}
    </div>
  );
}

export default HabitsSection;