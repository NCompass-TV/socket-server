// Description: License's Anydesk
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

export class API_LicenseAnydesk {
    licenseId: string;
    anydeskId: string;

    constructor(license_id: string, anydesk_id: string) {
        this.licenseId = license_id;
        this.anydeskId = anydesk_id;
    }
}

export type PI_LicenseAnydesk = {
    license_id: string,
    anydesk: string
}