// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn expand_scope(app_handle: tauri::AppHandle, folder_path: std::path::PathBuf) -> Result<(), String> {
  println!("Expanding {}", folder_path.to_str().expect("Frontend passes a folder path"));

  app_handle.fs_scope().allow_directory(&folder_path, false)
    .map_err(|err| err.to_string())
}

#[tauri::command]
fn get_scope_size(app_handle: tauri::AppHandle) {
  println!("Getting scope size");
  
  println!("{}",app_handle.fs_scope().allowed_patterns().len());
  app_handle.fs_scope().allowed_patterns().iter().for_each(|x| {
    println!("Hi {}", x)
  });
}

fn main() {
    tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![expand_scope, get_scope_size])
      .plugin(tauri_plugin_store::Builder::default().build())
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
