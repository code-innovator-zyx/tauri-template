use tauri::{Builder, Wry};
mod  pxq;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let builder = tauri::Builder::default().plugin(tauri_plugin_shell::init());
  register_handler(builder)
    .run(tauri::generate_context!())
    .expect("error while runing tauri app");
}
// 注册函数
fn register_handler(builder: Builder<crate::Wry>) -> Builder<crate::Wry> {
  builder.invoke_handler(tauri::generate_handler![])
}
