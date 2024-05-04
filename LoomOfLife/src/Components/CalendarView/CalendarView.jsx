import { invoke } from "@tauri-apps/api/tauri";
import { Store } from "tauri-plugin-store-api";
import "./CalendarView.css";
import DailyEntry from "./DailyEntry/DailyEntry";
import TopBar from "./Topbar/TopBar";
import { createContext, useEffect, useState } from "react";
import WeekSelector from "./WeekSelector";
import { convertDateToString, getMonday } from "../Helper";
import dayjs from "dayjs";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

const store = new Store(".settings.dat");
export const VaultContext = createContext(null);
export const SelectedMondayContext = createContext(null);
export const ConfigTextContext = createContext(null);

function CalendarView() {
  
  const [vaultPath, setVaultPath] = useState("");
  const [selectedMonday, setSelectedMonday] = useState(getMonday(dayjs()));
  const [configText, setConfigText] = useState(null);

  const expandIntoScope = (path) => {
    invoke("expand_scope", {folderPath: `${path}`});
    //invoke("get_scope_size");
  }

  useEffect(()=>{
    //Retrieve Vault Path
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
    //Expand FS Scope into Vault Path
    if (vaultPath){
      expandIntoScope(vaultPath);

      const retrieveConfig = async () => {
        const filePath = `${vaultPath}\\config.txt`;
        const configExists = await exists(filePath);
        if (configExists){
          let text = await readTextFile(filePath)
            .catch(err => {console.log(err)});
          setConfigText(text);
        } 
        else {
          setConfigText(convertDateToString(dayjs()))
        }
      }
      retrieveConfig();
    }
  }, [vaultPath])

  const writeConfigText = async (newConfig) => {
    if (!configText){
      return;
    }

    const filePath = `${vaultPath}\\config.txt`;
    setConfigText(newConfig);
    await writeTextFile(filePath, newConfig);
  }

  return (
    <SelectedMondayContext.Provider value = {[selectedMonday, setSelectedMonday]}>
    <VaultContext.Provider value = {[vaultPath, setVaultPath]}>
    <ConfigTextContext.Provider value = {[configText, writeConfigText]}>
      <div className="CalendarView">
        <div className="CalendarView_VaultPath">{vaultPath}</div>
        <TopBar />

        <div className="CalendarView_scrollSection">
          {vaultPath == ""?
          "No Vault Selected."
          :
          [...Array(7)].map((_, i) => {
            return <DailyEntry key={i} date={selectedMonday.add(i, 'day')} />
          })
          }
        </div>

        <WeekSelector/>
      </div>
    </ConfigTextContext.Provider>
    </VaultContext.Provider>
    </SelectedMondayContext.Provider>
  );
}
  
export default CalendarView;