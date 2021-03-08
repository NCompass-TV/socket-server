export class LicenseSocket {
    licenseId: string;
    playerSocketId: string;
    piSocketId: string;

    constructor(
        license_id: string,
        player_socket_id: string,
        pi_socket_id: string
    ) {
        this.licenseId = license_id;
        this.playerSocketId = player_socket_id;
        this.piSocketId = pi_socket_id;        
    }
}

export class LicenseSocketTime {
    licenseId: string;
    piSocketId: string;
    timeIn: string;

    constructor(license_id: string, pi_socketid: string, timein: string) {
        this.licenseId = license_id;
        this.piSocketId = pi_socketid;
        this.timeIn = timein;
    }
}