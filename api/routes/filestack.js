const express = require('express');
const router = express.Router();
const controller = require('../../lib/controllers/controllers');

router.post('', async (req, res) => {
	try {
		let io = req.app.get('io');
		console.log('Video Converted Body', req.body);
		await controller.updateConvertedVideo(req.body.uuid);
		io.sockets.emit('video_converted', req.body.uuid);
	} catch(err) {
		console.log(err);
	}
})

module.exports = router