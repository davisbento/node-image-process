import Queue from 'bull';

const gm = require('gm').subClass({ imageMagick: '7+' });

const queueName = 'image processing';

const imageProcessing = new Queue(queueName, 'redis://127.0.0.1:6379');

const uploadPath = 'uploads';

imageProcessing.process(async (job) => {
	console.log('Processing job', job.data);
	// get the file name from the job data
	const filename = job.data.item as string;
	const srcPath = `${uploadPath}/raw/${filename}`;
	const dstPath = `${uploadPath}/resized/${filename}`;

	// resize the image using the imagemark library
	gm(srcPath)
		.resize(240, 240)
		.noProfile()
		.write(dstPath, function (err: Error) {
			if (!err) console.log('done');
		});
});

imageProcessing.on('completed', (job) => {
	console.log('Job completed', job.data);
});

imageProcessing.on('failed', (job, err) => {
	console.log('Job failed', job.data, err);
});

export const addFileToQueue = (item: string) => {
	imageProcessing.add({ item });
};

console.log('🚀 Worker running');
