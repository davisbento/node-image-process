import Queue from 'bull';

const videoQueue = new Queue('video transcoding', 'redis://127.0.0.1:6379');

videoQueue.process(async (job) => {
	console.log('Processing job', job.data);
});

console.log('🚀 Worker running');
