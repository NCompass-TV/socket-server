import { ENVIRONMENT } from '../constants/Environments';
import { production } from './environment.production';
import { staging } from './environment.staging';
import { development } from './environment';

const NODE_ENV = process.env.NODE_ENV;

export function envconfig(): { uri: string | undefined } {
    switch(NODE_ENV) {
        case ENVIRONMENT.dev:
            return development;
            break;
        case ENVIRONMENT.staging:
            return staging;
            break;
        case ENVIRONMENT.prod:
            return production;
            break;
        default:
            return development;
    }
}