export enum SOCKET_EVENTS {
    anydesk = "SS_anydesk_id",
    anydesk_result = "SS_anydesk_id_result",
    connect = "connect",
    content = "SS_launch_update",
    content_update_success = "SS_update_finish",
    disconnect = "disconnect",
    electron = "SS_is_electron_running",
    electron_up = "SS_electron_is_running",
    logs_sent = "SS_logs_sent",
    offline_license = "SS_license_is_offline",
    offline_pi = "SS_offline_pi",
    offline_player = "SS_offline_player",
    online_pi = "SS_online_pi",
    reboot_all = "SS_reboot_all",
    refetch = "SS_launch_refetch",
    reset = "SS_launch_reset", 
    restart = "SS_pi_restart",
    restart_anydesk = "SS_restart_anydesk",
    restart_player = "SS_restart_player",
    speed_test = "SS_launch_speed_test",
    speed_test_failed = "SS_speed_test_failed",
    speed_test_success = "SS_speed_test_success",
    screenshot = "SS_launch_screenshot",
    screenshot_failed = "SS_screenshot_failed",
    screenshot_success = "SS_screenshot_success",
    system_update_all = "SS_remote_update",
    system_update_by_license = "SS_remote_update_by_license",
    ui_is_dead = "SS_ui_is_dead",
    upgrade_to_v2 = "SS_upgrade_to_v2_by_license"
}

export enum DASHBOARD_SOCKET_EVENTS {
    anydesk = "D_anydesk_id",
    content = "D_update_player",
    electron = "D_is_electron_running",
    reboot_all = "D_system_reboot",
    refetch = "D_refetch_pi", 
    reset = "D_reset_pi", 
    restart = "D_pi_restart",
    restart_player = "D_player_restart",
    restart_anydesk = "D_restart_anydesk",
    screenshot = "D_screenshot_pi",
    speed_test = "D_speed_test",
    system_update_all = "D_system_udpate",
    system_update_by_license = "D_system_update_by_license",
    upgrade_to_v2 = "D_upgrade_to_v2_by_license"
}

export enum PLAYER_SOCKET_EVENTS {
    anydesk_id = "PS_anydesk_id",
    electron_down = "PS_electron_is_not_running",
    electron_up = "PS_electron_is_running",
    license_saved = "PS_pi_license_saved",
    logs_sent = "PS_logs_sent",
    online_pi = "PS_pi_is_online",
    screenshot_failed = "PS_screenshot_failed",
    screenshot_uplaoded = "PS_screenshot_uploaded",
    speed_test_success = "PS_speed_test_success",
    speed_test_failed = "PS_speed_test_failed",
    update_finish = "PS_update_finish",
    ui_is_dead = "PS_ui_is_dead"
}

export enum FILESTACK {
    video_converted = "video_converted"
}