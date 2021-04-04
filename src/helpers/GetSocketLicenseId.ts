// Description: Get Socket License ID
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import axios, { AxiosResponse } from 'axios';
import { ActivityLogger } from './AcitivityLogger';
import { LOG_TYPES } from '../constants/Logger';

export class GetSocketLicenseId {

    /**
     * Get Socket License ID
     * @param data - Socket ID
    */
    async invoke(data: any): Promise<any> {
        try {
            const response: AxiosResponse = await axios.get(`${process.env.API_URL}/License/GetByPiSocketId?socketid=${data}`);
            return response.data;
        } catch (error) {
            new ActivityLogger(LOG_TYPES.error, 
            `Error on #GetSocketLicenseId.invoke(): { message: ${error.message}, payload: ${JSON.stringify(data)}}`);
        }
    }

}