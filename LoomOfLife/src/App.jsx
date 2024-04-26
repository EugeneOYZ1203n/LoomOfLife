import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [fileName, setFileName] = useState("");

  async function save() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    await invoke("save", { fileName })
  }

  return (
    <div className="container">
      <h1>Testing File System</h1>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <input
          id="file_name"
          onChange={(e) => setFileName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Create</button>
      </form>

      <p>Saving to {fileName}</p>
    </div>
  );
}

export default App;
