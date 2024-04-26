// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn save(app_handle: tauri::AppHandle, file_name: &str) -> Result<(),String> {
    let resource_path = app_handle.path_resolver()
      .resolve_resource("savefiles/bar.txt")
      .expect("failed to resolve resource");

    println!("{}",resource_path.display());

    fs::write(&resource_path, file_name.to_string()).map_err(|err| err.to_string())?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![save])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
