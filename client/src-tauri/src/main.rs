#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use steamworks::Client;

#[tauri::command]
fn get_steam_id(client: tauri::State<steamworks::Client>) -> String { // > We need string, because Steam IDs are too big for js Number type
    client.user().steam_id().raw().to_string()
}

#[tauri::command]
fn get_steam_auth_ticket(client: tauri::State<steamworks::Client>) -> Vec<u8> {
    let (_ticket_handle, ticket_bits) = client.user().authentication_session_ticket();
    ticket_bits
}

fn main() {
    let (client, _single) = Client::init().unwrap();

    tauri::Builder::default()
        .manage(client)
        .invoke_handler(tauri::generate_handler![get_steam_id, get_steam_auth_ticket])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
