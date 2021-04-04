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
        this.onAnydeskRestart();
        this.onElectronCheck();
        this.onPiRestart();
        this.onPlayerRestart();
        this.onRebootAll();
        this.onRefetchPlayerData();
        this.onResetPlayer();
        this.onScreenshot();
        this.onSpeedTest();
        this.onSystemUpdate();
        this.onSystemUpdateByLicense();
        this.onUpdatePlayer();
        this.onUpgradePlayer();
    }

    onAnydeskRequest(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.anydesk, (data: any) => {
            this.io.emit(SOCKET_EVENTS.anydesk, data);
            new ActivityLogger(LOG_TYPES.success, `__Dashboard Anydesk Request signal sent to license: ${data}`);
        })
    }

    onAnydeskRestart(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.restart_anydesk, async (data: any) => {
            const res: any = await new GetLicenseSocketId().invoke(data);
            if (res && this.io.sockets.connected[res.piSocketId] !== undefined) {
                this.io.to(res.piSocketId).emit(SOCKET_EVENTS.restart_anydesk, data);
                new ActivityLogger(LOG_TYPES.success, `__Dashboard Restart Anydesk signal sent to license: ${res.licenseId}`);
            } else {
                this.io.emit(SOCKET_EVENTS.offline_license, data);
            }
        })
    }

    onElectronCheck(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.electron, async (data: any) => {
            const res: any = await new GetLicenseSocketId().invoke(data);
            if (res && this.io.sockets.connected[res.piSocketId] !== undefined) {
                this.io.to(res.piSocketId).emit(SOCKET_EVENTS.electron, data);
                new ActivityLogger(LOG_TYPES.success, `__Dashboard Electron Check signal sent to license: ${res.licenseId}`);
            } else {
                this.io.emit(SOCKET_EVENTS.offline_license, data);
            }
        })
    }

    onPiRestart(): void {
		this.socket.on(DASHBOARD_SOCKET_EVENTS.restart, (data: any) => {
            this.io.emit(SOCKET_EVENTS.restart, data);
            new ActivityLogger(LOG_TYPES.success, `__Dashboard Restart Pi signal sent to license: ${data}`);
        })
    }

    onPlayerRestart(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.restart_player, (data: any) => {
            this.io.emit(SOCKET_EVENTS.restart_player, data);
            new ActivityLogger(LOG_TYPES.success, `__Dashboard Restart Player signal sent to license: ${data}`);
        })
    }

    onRebootAll(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.reboot_all, () => {
            this.io.emit(SOCKET_EVENTS.reboot_all);
            new ActivityLogger(LOG_TYPES.success, `__Dashboard Reboot signal sent to all licenses`);
        })
    }

    onRefetchPlayerData(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.refetch, async (data) => {
            const res: any = await new GetLicenseSocketId().invoke(data);
            if (res && this.io.sockets.connected[res.piSocketId] !== undefined) {
                this.io.to(res.piSocketId).emit(SOCKET_EVENTS.refetch, res.licenseId);
                new ActivityLogger(LOG_TYPES.success, `__Dashboard Refetch Update signal sent to license: ${res.licenseId}`);
            } else {
                this.io.emit(SOCKET_EVENTS.offline_license, data);
            }
        })
    }

    onResetPlayer(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.reset, async (data) => {
            const res: any = await new GetLicenseSocketId().invoke(data);
            if (res && this.io.sockets.connected[res.piSocketId] !== undefined) {
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

    onScreenshot(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.screenshot, async (data: any) => {
            const res: any = await new GetLicenseSocketId().invoke(data);
            if (res && this.io.sockets.connected[res.piSocketId] !== undefined) {
                this.io.to(res.piSocketId).emit(SOCKET_EVENTS.screenshot, data);
                new ActivityLogger(LOG_TYPES.success, `__Dashboard Screenshot signal sent to license: ${res.licenseId}`);
            } else {
                this.io.emit(SOCKET_EVENTS.offline_license, data);
            }
        })
    }

    onSpeedTest(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.speed_test, async(data) => {
            const res: any = await new GetLicenseSocketId().invoke(data);
            if (res && this.io.sockets.connected[res.piSocketId] !== undefined) {
                this.io.to(res.piSocketId).emit(SOCKET_EVENTS.speed_test, data);
                new ActivityLogger(LOG_TYPES.success, `__Dashboard Speed Test signal sent to license: ${res.licenseId}`);
            } else {
                this.io.emit(SOCKET_EVENTS.offline_license, data);
            }
        })
    }

    onSystemUpdate(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.system_update_all, () => {
            this.io.emit(SOCKET_EVENTS.system_update_all);
            new ActivityLogger(LOG_TYPES.success, `__Dashboard System Update signal sent to all licenses`);
        })
    }

    onSystemUpdateByLicense(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.system_update_by_license, data => {
            this.io.emit(SOCKET_EVENTS.system_update_by_license, data);
            new ActivityLogger(LOG_TYPES.success, `__Dashboard System Update signal sent to ${data}`);
        })
    }

    onUpdatePlayer(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.content, async (data: any) => {
            const res: any = await new GetLicenseSocketId().invoke(data)
            if (res && this.io.sockets.connected[res.piSocketId] !== undefined) {
                this.io.to(res.piSocketId).emit(SOCKET_EVENTS.content, data);
                new ActivityLogger(LOG_TYPES.success, `__Dashboard Content Update signal sent to ${data}`);
            } else {
                this.io.emit(SOCKET_EVENTS.offline_license, data);
            }
        })
    }

    onUpgradePlayer(): void {
        this.socket.on(DASHBOARD_SOCKET_EVENTS.upgrade_to_v2, (data: any) => {
            if (data) {
                new ActivityLogger(LOG_TYPES.success, `__Dashboard Content Upgrade to V2 signal sent to ${data}`);
                this.io.emit(SOCKET_EVENTS.upgrade_to_v2, data);
            }
        })
    }
}