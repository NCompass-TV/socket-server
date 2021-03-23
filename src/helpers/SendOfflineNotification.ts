// Description: Append Socket ID to License Service
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import axios, { AxiosResponse } from 'axios';
import { LOG_TYPES } from '../constants/Logger';
import { ActivityLogger } from './AcitivityLogger';

export class SendOfflineNotification {
    
    /**
     * Send Offline Notification
     * @param data - License ID
    */
    async invoke(data: any) {
        try {
            const response: AxiosResponse = await axios.post(`${process.env.API_URL}/notification/send`, data);
            return response.data;
        } catch (error) {
            new ActivityLogger(LOG_TYPES.error, 
            `Error on #SendOfflineNotification.invoke(): { message: ${error.message}, payload: ${JSON.stringify(data)}}`);
        }
    }
}