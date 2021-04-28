// Description: Get License Socket ID
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import axios, { AxiosResponse } from 'axios';
import { ActivityLogger } from './AcitivityLogger';
import { LOG_TYPES } from '../constants/Logger';
import { envconfig } from '../environment/envconfig';

export class SetConvertedVideoStatus {
    environment: {
        uri: string | undefined
    }

    constructor() {
        this.environment = envconfig();
    }

    /**
     * Set Status of Converted Video from Filestack 
     * @param data - 
    */
    async invoke(data: any): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(`${this.environment}/Content/UpdateContentsIsConverted?uuid=${data}`);
            return response.data;
        } catch (error) {
            new ActivityLogger(LOG_TYPES.error,
            `Error on #SetConvertedVideoStatus.invoke(): { message: ${error.message}, payload: ${JSON.stringify(data)}}`);
        }
    }

}