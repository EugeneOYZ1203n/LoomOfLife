import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import CalendarView from "./Components/CalendarView/CalendarView";

function App() {
  return (
    <>
      <CalendarView />
    </>
  );
}

export default App;
