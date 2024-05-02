import { invoke } from "@tauri-apps/api/tauri";
import "./StatusSection.css";

function StatusSection({contents}) {
  return (
    <div>
      {contents}
    </div>
  );
}

export default StatusSection;