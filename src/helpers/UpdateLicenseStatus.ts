// Description: Get License Socket ID
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import axios, { AxiosResponse } from 'axios';
import { ActivityLogger } from './AcitivityLogger';
import { LOG_TYPES } from '../constants/Logger';

export class UpdateLicenseStatus {

    /**
     * Update License Pi and Player Status
     * @param data - License ID
    */
    async invoke(data: any): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(`${process.env.API_URL}/license/UpdatePiPlayerStatus`, data);
            return response.data;
        } catch (error) {
            new ActivityLogger(LOG_TYPES.error, 
            `Error on #UpdateLicenseStatus.invoke(): { message: ${error.message}, payload: ${JSON.stringify(data)}}`);
        }
    }
}