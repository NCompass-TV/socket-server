// Description: Player Socket Events
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import * as logsym from 'log-symbols';
import moment from 'moment-timezone';
import { AppendSocketIdToLicense } from '../helpers/AppendSocketIdToLicense';
import { LicenseSocket, LicenseSocketTime } from '../models/LicenseSocket';
import { PLAYER_SOCKET_EVENTS, SOCKET_EVENTS } from '../constants/SocketEvents';
import { PlayerStatus } from '../models/PlayerStatus';
import { SaveLicensesAnydesk } from '../helpers/SaveLicenseAnydesk';
import { SendOfflineNotification } from '../helpers/SendOfflineNotification';
import { Server, Socket } from 'socket.io';
import { UpdateLicenseStatus } from '../helpers/UpdateLicenseStatus';
import { OfflinePlayer } from '../models/OfflinePlayer';
import { ActivityLogger } from '../helpers/AcitivityLogger';
import { LOG_TYPES } from '../constants/Logger';

export class PlayerSocketEvents {
    io: Server;
    socket: Socket;

    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;

        this.onAnydeskRequest();
        this.onElectronDown();
        this.onElectronUp();
        this.onLicenseSaved();
        this.onOnlinePi();
        this.onScreenshotFailed();
        this.onScreenshotUploaded();
        this.onSpeedTestFailed();
        this.onSpeedTestSuccess();
        this.onUpdateFinished();
        this.onUIDead();
    }

    onAnydeskRequest(): void {
        this.socket.on(PLAYER_SOCKET_EVENTS.anydesk_id, async (data: any) => {
            if (data) {
                this.io.sockets.emit(SOCKET_EVENTS.anydesk_result, data);
                await new SaveLicensesAnydesk().invoke(data);
                new ActivityLogger(LOG_TYPES.success, `__Player Anydesk Request: ${data.license_id} | ${data.anydesk}`);
            }
        })
    }

    onElectronDown(): void {
        this.socket.on(PLAYER_SOCKET_EVENTS.electron_down, async (data: any) => {
            if (data) {
                this.io.emit(SOCKET_EVENTS.offline_player, data);
                await new SendOfflineNotification().invoke(new OfflinePlayer(
                    this.socket.id,
                    data,
                    2
                ));

                await new UpdateLicenseStatus().invoke(new PlayerStatus(
                    data,
                    1,
                    0
                ));

                new ActivityLogger(LOG_TYPES.success, `__Player is Down: ${data}`);
            }
        })
    }

    onElectronUp(): void {
        this.socket.on(PLAYER_SOCKET_EVENTS.electron_up, async (data: any) => {
            if (data) {
                this.io.emit(SOCKET_EVENTS.electron_up, data);

                // await new SendOfflineNotification().invoke(new OfflinePlayer(
                //     this.socket.id,
                //     data,
                //     2
                // ))

                new ActivityLogger(LOG_TYPES.success, `__Player is Running: ${data}`);
            }
        })
    }

    onLicenseSaved(): void {
        this.socket.on(PLAYER_SOCKET_EVENTS.license_saved, async (data: any) => {
            if (data) {
                await new AppendSocketIdToLicense().invoke(new LicenseSocket(
                    data,
                    '',
                    this.socket.id
                ))

                new ActivityLogger(LOG_TYPES.success, `__Player License Saved: ${data}`);
            }
        })
    }

    onOnlinePi(): void {
        this.socket.on(PLAYER_SOCKET_EVENTS.online_pi, async (data: any) => {
            if (data) {
                await new UpdateLicenseStatus().invoke(new PlayerStatus(
                    data.licenseId,
                    1,
                    0
                ));

                await new AppendSocketIdToLicense().invoke(new LicenseSocketTime(
                    data.licenseId,
                    this.socket.id,
                    data.timeZone ? moment().tz(data.timeZone).format("MMMM DD, YYYY, h:mm:ss A") : ''
                ))

                this.io.sockets.emit(SOCKET_EVENTS.online_pi, data.licenseId);
                new ActivityLogger(LOG_TYPES.success, `__Player is Online: ${data.licenseId}`);
            }
        })
    }

    onScreenshotFailed(): void {
        this.socket.on(PLAYER_SOCKET_EVENTS.screenshot_failed, (data: any) => {
            if (data && data.license_id) {
                this.io.sockets.emit(SOCKET_EVENTS.screenshot_failed, data.license_id);
                new ActivityLogger(LOG_TYPES.warning, `__Player Screenshot Failed: ${data.license_id}`);
            }
        })
    }

    onScreenshotUploaded(): void {
        this.socket.on(PLAYER_SOCKET_EVENTS.screenshot_uplaoded, data => {
            if (data && data.license_id) {
                this.io.sockets.emit(SOCKET_EVENTS.screenshot_success, data.license_id);
                new ActivityLogger(LOG_TYPES.success, `__Player Screenshot Success: ${data.license_id}`);
            }
        })
    }

    onSpeedTestSuccess(): void {
        this.socket.on(PLAYER_SOCKET_EVENTS.speed_test_success, data => {
            if (data && data.license_id) {
                this.io.sockets.emit(SOCKET_EVENTS.speed_test_success, data);
                new ActivityLogger(LOG_TYPES.success, `__Player SpeedTest Success: ${data}`);
            }
        })
    }

    onSpeedTestFailed(): void {
        this.socket.on(PLAYER_SOCKET_EVENTS.speed_test_failed, data => {
            if (data && data.license_id) {
                this.io.sockets.emit(SOCKET_EVENTS.speed_test_failed, data);
                new ActivityLogger(LOG_TYPES.success, `__Player SpeedTest Failed: ${data.license_id}`);
            }
        })
    }

    onUpdateFinished(): void {
        this.socket.on(PLAYER_SOCKET_EVENTS.update_finish, data => {
            if (data) {
                this.io.sockets.emit(SOCKET_EVENTS.content_update_success, data)
                new ActivityLogger(LOG_TYPES.success, `__Player Content Update Success: ${data}`)
            }
        })
    }

    onUIDead(): void {
        this.socket.on(PLAYER_SOCKET_EVENTS.ui_is_dead, data => {
            if (data) {
                this.io.sockets.emit(SOCKET_EVENTS.ui_is_dead, data);
                new ActivityLogger(LOG_TYPES.warning, `__Player UI Died for: ${data}`)
            }
        })
    }
}