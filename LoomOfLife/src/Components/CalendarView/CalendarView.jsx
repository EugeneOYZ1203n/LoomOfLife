import { invoke } from "@tauri-apps/api/tauri";
import { Store } from "tauri-plugin-store-api";
import "./CalendarView.css";
import DailyEntry from "./DailyEntry/DailyEntry";
import TopBar from "./Topbar/TopBar";
import { useEffect, useState } from "react";

function CalendarView() {
  
  const [vaultPath, setVaultPath] = useState("")

  useEffect(()=>{
    const getVaultPath = async () => {
      const store = new Store(".settings.dat");
      const vault_path = await store.get("vault_path");
  
      setVaultPath(vault_path?vault_path.value:"");
    }
    if (vaultPath == ""){
      getVaultPath();
    }
  }, [])
  

  let dailyEntrys = [1,2,3,4,5,6,7];

  return (
    <div className="CalendarView">
      <TopBar />

      {vaultPath == ""?
        <div>
          No Vault Selected. Please select one and restart the app.
        </div>:

        <div className="CalendarView_scrollSection">
          {dailyEntrys.map((entry) => {
            return <DailyEntry fileName={""} />
          })}
          
          <div>
            Select Week
          </div>
        </div>
      }
    </div>
  );
}
  
export default CalendarView;