import { invoke } from "@tauri-apps/api/tauri";

import "./TopBar.css";
import VaultSelection from "./VaultSelection";

function TopBar() {

  return (
    <div className="TopBar">
      <div className="TopBar_item">Input + Button</div>
      <div className="TopBar_item">Tags</div>
      <div className="TopBar_item">Statuses</div>
      <div className="TopBar_item">Events</div>
      <div className="TopBar_item">Tasks</div>
      <div className="TopBar_item">
        <VaultSelection />
      </div>
    </div>
  );
}

export default TopBar;