import { invoke } from "@tauri-apps/api/tauri";

import "./TopBar.css";
import VaultSelection from "./VaultSelection";

function TopBar() {

  


  return (
    <div className="TopBar_row">
      <div>Input + Button</div>
      <div>Tags</div>
      <div>Statuses</div>
      <div>Events</div>
      <div>Tasks</div>
      <div>
        <VaultSelection />
      </div>
    </div>
  );
}

export default TopBar;