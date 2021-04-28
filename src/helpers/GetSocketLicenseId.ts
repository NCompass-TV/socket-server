// Description: Get Socket License ID
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import axios, { AxiosResponse } from 'axios';
import { ActivityLogger } from './AcitivityLogger';
import { LOG_TYPES } from '../constants/Logger';
import { envconfig } from '../environment/envconfig';

export class GetSocketLicenseId {
    environment: {
        uri: string | undefined
    }

    constructor() {
        this.environment = envconfig();
    }

    /**
     * Get Socket License ID
     * @param data - Socket ID
    */
    async invoke(data: any): Promise<any> {
        try {
            const response: AxiosResponse = await axios.get(`${this.environment.uri}/License/GetByPiSocketId?socketid=${data}`);
            return response.data;
        } catch (error) {
            new ActivityLogger(LOG_TYPES.error, 
            `Error on #GetSocketLicenseId.invoke(): { message: ${error.message}, payload: ${JSON.stringify(data)}}`);
        }
    }

}