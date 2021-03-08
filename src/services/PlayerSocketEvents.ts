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
    }

    onAnydeskRequest() {
        this.socket.on(PLAYER_SOCKET_EVENTS.anydesk_id, async (data: any) => {
            if (data) {
                this.io.sockets.emit(SOCKET_EVENTS.anydesk_result, data);
                await new SaveLicensesAnydesk().invoke(data);
                new ActivityLogger(LOG_TYPES.success, `__Player Anydesk Request: ${data.license_id} | ${data.anydesk}`);
            }
        })
    }

    onElectronDown() {
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

    onElectronUp() {
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

    onLicenseSaved() {
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

    onOnlinePi() {
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

                new ActivityLogger(LOG_TYPES.success, `__Player is Online: ${data.licenseId}`);
            }
        })
    }

    onScreenshotFailed() {
        this.socket.on(PLAYER_SOCKET_EVENTS.screenshot_failed, (data: any) => {
            if (data && data.license_id) {
                this.io.sockets.emit(SOCKET_EVENTS.screenshot_failed, data.license_id);
                new ActivityLogger(LOG_TYPES.warning, `__Player Screenshot Failed: ${data.license_id}`);
            }
        })
    }

    onScreenshotUploaded() {
        this.socket.on(PLAYER_SOCKET_EVENTS.screenshot_uplaoded, data => {
            if (data && data.license_id) {
                this.io.sockets.emit(SOCKET_EVENTS.screenshot_success, data.license_id);
                new ActivityLogger(LOG_TYPES.warning, `__Player Screenshot Success: ${data.license_id}`);
            }
        })
    }
}