// Description: Get License Socket ID
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import axios, { AxiosResponse } from 'axios';
import { LOG_TYPES } from '../constants/Logger';
import { envconfig } from '../environment/envconfig';
import { ActivityLogger } from './AcitivityLogger';

export class GetLicenseSocketId {
    environment: {
        uri: string | undefined
    }

    constructor() {
        this.environment = envconfig();
    }

    /**
     * Get License Socket ID
     * @param data - License ID
    */
    async invoke(data: any): Promise<any> {
        try {
            const response: AxiosResponse = await axios.get(`${this.environment.uri}/license/GetSocketByLicense?licenseId=${data}`);

            if (response.data && response.data.message) {
                new ActivityLogger(LOG_TYPES.info, 
                `Warning on #GetLicenseSocketId.invoke(): { message: ${response.data.message}, payload: ${JSON.stringify(data)}}`);
            }

            return response.data;
        } catch (error) {
            new ActivityLogger(LOG_TYPES.error, 
            `Error on #GetLicenseSocketId.invoke(): { message: ${error.message}, payload: ${JSON.stringify(data)}}`);
        }
    }
} 