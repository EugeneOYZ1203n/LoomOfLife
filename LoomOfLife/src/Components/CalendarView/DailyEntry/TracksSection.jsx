import { invoke } from "@tauri-apps/api/tauri";
import "./TracksSection.css";

function TracksSection({contents}) {
  return (
    <div>
      {contents}
    </div>
  );
}

export default TracksSection;