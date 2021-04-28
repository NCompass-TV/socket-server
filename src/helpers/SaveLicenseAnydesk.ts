// Description: Save License's Anydesk
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import axios, { AxiosResponse } from 'axios';
import { API_LicenseAnydesk, PI_LicenseAnydesk } from '../models/LicenseAnydesk';
import { ActivityLogger } from './AcitivityLogger';
import { LOG_TYPES } from '../constants/Logger';
import { envconfig } from '../environment/envconfig';


export class SaveLicensesAnydesk {
    environment: {
        uri: string | undefined
    }

    constructor() {
        this.environment = envconfig();
    }
    
    /**
     * Save License's Anydesk
     * @param data - License and Anydesk info from Pi
    */
    async invoke(data: PI_LicenseAnydesk): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(`${this.environment.uri}/license/UpdateAnydeskId`, new API_LicenseAnydesk(data.license_id, data.anydesk));
            return response.data;
        } catch (error) {
            new ActivityLogger(LOG_TYPES.error, 
            `Error on #SaveLicensesAnydesk.invoke(): { message: ${error.message}, payload: ${JSON.stringify(data)}}`);
        }
    }
}