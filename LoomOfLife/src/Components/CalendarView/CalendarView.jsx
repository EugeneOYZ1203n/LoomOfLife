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
    //invoke("get_scope_size");
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
        <div className="CalendarView_VaultPath">{vaultPath}</div>
        <TopBar />

        <div className="CalendarView_scrollSection">
          {vaultPath == ""?
          "No Vault Selected."
          :
          [...Array(7)].map((_, i) => {
            return <DailyEntry date={selectedMonday.add(i, 'day')} />
          })
          }
        </div>

        <WeekSelector/>
      </div>
    </VaultContext.Provider>
    </SelectedMondayContext.Provider>
  );
}
  
export default CalendarView;