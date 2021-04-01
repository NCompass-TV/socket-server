// Description: Socket Service
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import * as logsym from 'log-symbols';
import moment from 'moment-timezone';
import { DashboardSocketEvents } from './DashboardSocketEvents';
import { GetSocketLicenseId } from '../helpers/GetSocketLicenseId';
import { OfflinePlayer } from '../models/OfflinePlayer';
import { PlayerStatus } from '../models/PlayerStatus';
import { SOCKET_EVENTS } from "../constants/SocketEvents";
import { SendOfflineNotification } from '../helpers/SendOfflineNotification';
import { Server, Socket } from "socket.io";
import { UpdateLicenseStatus } from '../helpers/UpdateLicenseStatus';
import { PlayerSocketEvents } from './PlayerSocketEvents';
import { ActivityLogger } from '../helpers/AcitivityLogger';
import { LOG_TYPES } from '../constants/Logger';

export class SocketService {
    io: Server;

    /**
     * Socket Event: On Connection Established
     * @param io: Initialize SocketIO Server
     * @param socket_client: Initialize AWS SocketClient
    */

    constructor(io: Server) {
        this.io = io;
    }

    call(): void {
        this.io.on(SOCKET_EVENTS.connect, async (socket: Socket) => {
            new ActivityLogger(LOG_TYPES.success, `Socket Connection Established with Socket ID: ${socket.id}`);

            /** Dashboard Socket Events **/
            new DashboardSocketEvents(this.io, socket);

            /** Player Socket Events **/
            new PlayerSocketEvents(this.io, socket);

            /** On Socket Client Disconnect **/
            socket.on(SOCKET_EVENTS.disconnect, async () => {
                const response: any = await new GetSocketLicenseId().invoke(socket.id);

                if (response && response.license) {
                    // Emit Disconnected License to Dashboard
                    this.io.sockets.emit(SOCKET_EVENTS.offline_pi, response.license.licenseId)
                    
                    // Send Offline Notification
                    await new SendOfflineNotification().invoke(new OfflinePlayer(
                        socket.id,
                        response.license.licenseId,
                        1,
                        response.timezone.name ? moment().tz(response.timezone.name).format("MMMM DD, YYYY, h:mm:ss A") : ''
                    ));

                    // Update Software and Device Status
                    await new UpdateLicenseStatus().invoke(new PlayerStatus(
                        response.license.licenseId,
                        0,
                        0
                    ));

                    new ActivityLogger(LOG_TYPES.warning, `Player disconnected: ${response.license.licenseId} -- ${socket.id}`);
                } else {
                    new ActivityLogger(LOG_TYPES.warning, `A socket connection has been destroyed: ${socket.id}`);
                }
            })
        })
    }
}