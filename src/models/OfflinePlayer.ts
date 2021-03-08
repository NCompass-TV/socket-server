export class OfflinePlayer {
    socketId: string;
    licenseId: string;
    status: number;
    timeout?: string;

    constructor(
        socket_id: string,
        license_id: string,
        status: number,
        timeout?: string
    ) {
        this.socketId = socket_id;
        this.licenseId = license_id;
        this.status = status;
        this.timeout = timeout;        
    }
}