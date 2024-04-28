import { invoke } from "@tauri-apps/api/tauri";
import "./SearchBar.css";

function SearchBar() {
  return (
    <div className="SearchBar_row">
      <div>Input + Button</div>
      <div>Sort By</div>
      <div>Filter Tags</div>
      <div>Manager Icons</div>
    </div>
  );
}

export default SearchBar;