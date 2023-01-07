import Queue from 'bull';
import gm from 'gm';

const queueName = 'image processing';

const imageProcessing = new Queue(queueName, 'redis://127.0.0.1:6379', {
	// Limit queue to max 5 jobs per 5 seconds.
	limiter: {
		max: 5,
		duration: 5000
	}
});

const uploadPath = 'uploads';

const gmInstance = gm.subClass({ imageMagick: '7+' });

imageProcessing.process(async (job) => {
	console.log('Processing job', job.data);

	const filename = job.data.item as string;

	const srcPath = `${uploadPath}/raw/${filename}`;
	const dstPath = `${uploadPath}/resized/${filename}`;

	gmInstance(srcPath)
		.resize(240, 240)
		.noProfile()
		.write(dstPath, function (err: Error) {
			if (err) {
				console.log('Error resizing image', err);
			}
		});
});

imageProcessing.on('completed', (job) => {
	console.log('Job completed', job.data);
});

imageProcessing.on('failed', (job, err) => {
	console.log('Job failed', job.data, err);
});

export const addFileToQueue = (item: string) => {
	imageProcessing.add(
		{ item },
		{
			attempts: 3
		}
	);
};

console.log('🚀 Worker running');
