// Description: Dashboard Socket Events
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import { DASHBOARD_SOCKET_EVENTS, SOCKET_EVENTS } from '../constants/SocketEvents';
import { GetLicenseSocketId } from '../helpers/GetLicenseSocketId';
import { PlayerStatus } from '../models/PlayerStatus';
import { Server, Socket } from 'socket.io';
import { UpdateLicenseStatus } from '../helpers/UpdateLicenseStatus';
import { ActivityLogger } from '../helpers/AcitivityLogger';
import { LOG_TYPES } from '../constants/Logger';

export class DashboardSocketEvents {
    io: Server;
    socket: Socket;

    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
        this.onAnydeskRequest();
        this.onElectronCheck();
        this.onPiRestart();
        this.onRefetchPlayerData();
        this.onResetPlayer();
        this.onScreenshot();
        this.onRebootAll();
        this.onSystemUpdate();
        this.onSystemUpdateByLicense();
        this.onUpdatePlayer();
    }

    onAnydeskRequest() {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.anydesk, (data: any) => {
            this.io.emit(SOCKET_EVENTS.anydesk, data);
            new ActivityLogger(LOG_TYPES.success, `__Dashboard Anydesk Request signal sent to license: ${data}`);
        })
    }

    onElectronCheck() {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.electron, async (data: any) => {
            const res: any = await new GetLicenseSocketId().invoke(data);
            if (this.io.sockets.connected[res.piSocketId] !== undefined) {
                this.io.to(res.piSocketId).emit(SOCKET_EVENTS.electron, data);
                new ActivityLogger(LOG_TYPES.success, `__Dashboard Electron Check signal sent to license: ${res.licenseId}`);
            } else {
                this.io.emit(SOCKET_EVENTS.offline_license, data);
            }
        })
    }

    onPiRestart() {
		this.socket.on(DASHBOARD_SOCKET_EVENTS.restart, (data: any) => {
            this.io.emit(SOCKET_EVENTS.restart, data);
            new ActivityLogger(LOG_TYPES.success, `__Dashboard Restart signal sent to license: ${data}`);
        })
    }

    onRefetchPlayerData() {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.refetch, async (data) => {
            const res: any = await new GetLicenseSocketId().invoke(data);
            if (this.io.sockets.connected[res.piSocketId] !== undefined) {
                this.io.to(res.piSocketId).emit(SOCKET_EVENTS.refetch, res.licenseId);
                new ActivityLogger(LOG_TYPES.success, `__Dashboard Refetch Update signal sent to license: ${res.licenseId}`);
            } else {
                this.io.emit(SOCKET_EVENTS.offline_license, data);
            }
        })
    }

    onResetPlayer() {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.reset, async (data) => {
            const res: any = await new GetLicenseSocketId().invoke(data);
            if (this.io.sockets.connected[res.piSocketId] !== undefined) {
                this.io.to(res.piSocketId).emit(SOCKET_EVENTS.reset, data);
                this.io.sockets.emit(SOCKET_EVENTS.offline_pi, res.licenseId);

                await new UpdateLicenseStatus().invoke(new PlayerStatus(
                    res.licenseId,
                    0,
                    0
                ))

                new ActivityLogger(LOG_TYPES.success, `__Dashboard Reset signal to license: ${res.licenseId}`);
            } else {
                this.io.emit(SOCKET_EVENTS.offline_license, data);
            }
        })
    }

    onScreenshot() {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.screenshot, async (data: any) => {
            const res: any = await new GetLicenseSocketId().invoke(data);
            if (this.io.sockets.connected[res.piSocketId] !== undefined) {
                this.io.to(res.piSocketId).emit(SOCKET_EVENTS.screenshot, data);
                new ActivityLogger(LOG_TYPES.success, `__Dashboard Screenshot signal sent to license: ${res.licenseId}`);
            } else {
                this.io.emit(SOCKET_EVENTS.offline_license, data);
            }
        })
    }

    onRebootAll() {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.reboot_all, () => {
            this.io.emit(SOCKET_EVENTS.reboot_all);
            new ActivityLogger(LOG_TYPES.success, `__Dashboard Reboot signal sent to all licenses`);
        })
    }

    onSystemUpdate() {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.system_update_all, () => {
            this.io.emit(SOCKET_EVENTS.system_update_all);
            new ActivityLogger(LOG_TYPES.success, `__Dashboard System Update signal sent to all licenses`);
        })
    }

    onSystemUpdateByLicense() {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.system_update_by_license, data => {
            this.io.emit(SOCKET_EVENTS.system_update_by_license, data);
            new ActivityLogger(LOG_TYPES.success, `__Dashboard System Update signal sent to ${data}`);
        })
    }

    onUpdatePlayer() {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.content, async (data: any) => {
            const res: any = await new GetLicenseSocketId().invoke(data)
            if (this.io.sockets.connected[res.piSocketId] !== undefined) {
                this.io.to(res.piSocketId).emit(SOCKET_EVENTS.content, data);
                new ActivityLogger(LOG_TYPES.success, `__Dashboard Content Update signal sent to ${data}`);
            } else {
                this.io.emit(SOCKET_EVENTS.offline_license, data);
            }
        })
    }
}