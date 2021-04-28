import * as dotenv from 'dotenv';
import path from 'path';

// Initialize Environment Variables
dotenv.config({
    path: path.join(__dirname, '../../', '.env')
});

export const staging = {
    uri: process.env.API_STAGING
}