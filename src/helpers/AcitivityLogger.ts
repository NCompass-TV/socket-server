import * as logsym from 'log-symbols';
import { LOG_TYPES } from '../constants/Logger';

export class ActivityLogger {

    type: string;
    message: string;

    constructor(type: string, message: string) {
        
        if (type ===  LOG_TYPES.error) {
            this.type = logsym.error;
        } else if (type === LOG_TYPES.info) {
            this.type = logsym.info;
        } else if (type === LOG_TYPES.success) {
            this.type = logsym.success;
        } else if (type === LOG_TYPES.warning){
            this.type = logsym.warning;
        } else {
            this.type = logsym.info;
        }

        this.message = message;

        console.log(this.type, `[${new Date()}]`, this.message);
    }

}