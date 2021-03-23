// Description: Append Socket ID to License Service
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import axios from 'axios';
import { ActivityLogger } from './AcitivityLogger';
import { LOG_TYPES } from '../constants/Logger';

export class AppendSocketIdToLicense {
    /**
     * Append Socket ID to License
     * @param data - Socket
    */
    async invoke(data: any) {
        try {
            const response = await axios.post(`${process.env.API_URL}/license/UpdateSocketIds`, data);
            return response.data;
        } catch (error) {
            new ActivityLogger(LOG_TYPES.error, 
            `Error on #AppendSocketIdToLicense.invoke(): { message: ${error.message}, payload: ${JSON.stringify(data)}}`);
        }
    }
}