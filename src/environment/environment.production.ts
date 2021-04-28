import * as dotenv from 'dotenv';
import path from 'path';

// Initialize Environment Variables
dotenv.config({
    path: path.join(__dirname, '../../', '.env')
});

export const production = {
    uri: process.env.API_PROD
}