// Description: Filestack Controller
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import { ActivityLogger } from '../helpers/AcitivityLogger';
import { FILESTACK } from '../constants/SocketEvents';
import { LOG_TYPES } from '../constants/Logger';
import { Router, Request, Response } from 'express';
import { Server } from 'socket.io';
import { SetConvertedVideoStatus } from '../helpers/SetConvertedVideoStatus';

const filestackRoutes: Router = Router();

filestackRoutes.post('', async (req: Request, res: Response) => {
	try {
		const io: Server = req.app.get('io');
		await new SetConvertedVideoStatus().invoke(req.body.uuid);
		io.emit(FILESTACK.video_converted, req.body.uuid);
	} catch(error) {
		new ActivityLogger(LOG_TYPES.error,
            `Error on #filestackRoutes_post: ${error.message}`);
	}
})

export default filestackRoutes;