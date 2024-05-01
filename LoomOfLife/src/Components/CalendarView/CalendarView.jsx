import { invoke } from "@tauri-apps/api/tauri";
import { Store } from "tauri-plugin-store-api";
import "./CalendarView.css";
import DailyEntry from "./DailyEntry/DailyEntry";
import TopBar from "./Topbar/TopBar";
import { createContext, useEffect, useState } from "react";
import WeekSelector from "./WeekSelector";
import { getMonday } from "../Helper";
import dayjs from "dayjs";

const store = new Store(".settings.dat");
export const VaultContext = createContext(null);
export const SelectedMondayContext = createContext(null);

function CalendarView() {
  
  const [vaultPath, setVaultPath] = useState("")
  const [selectedMonday, setSelectedMonday] = useState(getMonday(dayjs()))

  const expandIntoScope = (path) => {
    invoke("expand_scope", {folderPath: `${path}`});
    invoke("get_scope_size");
  }

  useEffect(()=>{
    const getVaultPath = async () => {
      const vault_path = await store.get("vault_path");
      if (vault_path){
        expandIntoScope(vault_path.value);
        setVaultPath(vault_path.value);
      }
    }
    getVaultPath();
  }, [])

  useEffect(()=>{
    if (vaultPath){
      expandIntoScope(vaultPath);
    }
  }, [vaultPath])

  return (
    <SelectedMondayContext.Provider value = {[selectedMonday, setSelectedMonday]}>
    <VaultContext.Provider value = {[vaultPath, setVaultPath]}>
      <div className="CalendarView">
        <TopBar />

        {vaultPath == ""?
          <div>
            No Vault Selected.
          </div>:

          <div className="CalendarView_scrollSection">
            {[...Array(7)].map((_, i) => {
              return <DailyEntry date={selectedMonday.add(i, 'day')} />
            })}
            
            <WeekSelector/>
          </div>
        }
      </div>
    </VaultContext.Provider>
    </SelectedMondayContext.Provider>
  );
}
  
export default CalendarView;