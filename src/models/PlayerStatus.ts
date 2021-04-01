export class PlayerStatus {
    licenseId: string;
    piStatus: number;
    playerStatus: number;

    constructor(
        license_id: string,
        pi_status: number,
        player_status: number
    ) {
        this.licenseId = license_id;
        this.piStatus = pi_status;
        this.playerStatus = player_status;     
    }
}