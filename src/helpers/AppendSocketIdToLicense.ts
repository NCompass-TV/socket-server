// Description: Append Socket ID to License Service
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import axios from 'axios';
import { ActivityLogger } from './AcitivityLogger';
import { LOG_TYPES } from '../constants/Logger';
import { envconfig } from '../environment/envconfig';

export class AppendSocketIdToLicense {
    environment: {
        uri: string | undefined
    }

    constructor() {
        this.environment = envconfig();
        console.log(this.environment);
    }

    /**
     * Append Socket ID to License
     * @param data - Socket
    */
    async invoke(data: any): Promise<any> {
        try {
            const response = await axios.post(`${this.environment.uri}/license/UpdateSocketIds`, data);
            return response.data;
        } catch (error) {
            new ActivityLogger(LOG_TYPES.error, 
            `Error on #AppendSocketIdToLicense.invoke(): { message: ${error.message}, payload: ${JSON.stringify(data)}}`);
        }
    }
}

new AppendSocketIdToLicense();