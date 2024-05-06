import { invoke } from "@tauri-apps/api/tauri";

import "./TopBar.css";
import VaultSelection from "./VaultSelection";

function TopBar() {

  return (
    <div className="TopBar">
      <div className="TopBar_item">SearchBar</div>
      <div className="TopBar_item">Config edit</div>
      <div className="TopBar_item">
        <VaultSelection />
      </div>
    </div>
  );
}

export default TopBar;