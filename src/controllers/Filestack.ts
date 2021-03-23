// Description: Filestack Controller
// Author(s): Earl Vhin Gabuat (earlgabuat@gmail.com)

import { FILESTACK } from '../constants/SocketEvents';
import { Router, Request, Response } from 'express';
import { SetConvertedVideoStatus } from '../helpers/SetConvertedVideoStatus';

const filestackRoutes: Router = Router();

filestackRoutes.post('', async (req: Request, res: Response) => {
	const io = req.app.get('io');
	await new SetConvertedVideoStatus().invoke(req.body.uuid);
	io.sockets.emit(FILESTACK.video_converted, req.body.uuid);
})

export default filestackRoutes;