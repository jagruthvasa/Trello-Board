// imageUpload.js
const { s3 } = require("./awsConfig");
const { v4: uuidv4 } = require("uuid");

const uploadToS3 = async (file) => {
	const fileName = `${uuidv4()}-${file.originalname}`;

	const params = {
		Bucket: process.env.S3_BUCKET_NAME,
		Key: fileName,
		Body: file.buffer,
		ContentType: file.mimetype,
	};

	try {
		const result = await s3.upload(params).promise();
		return result.Location;
	} catch (error) {
		console.error("Error uploading to S3:", error);
		throw error;
	}
};

module.exports = { uploadToS3 };
