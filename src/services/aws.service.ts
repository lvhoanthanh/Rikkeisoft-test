import { S3 } from 'aws-sdk';
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
import { CommonHelper } from "../helpers/common";

const path = require('path');

class AWSService {
  static async uploadPublicFile(dataBuffer: Buffer, originalName: string, mimetype:string) {
    const name = originalName.split('.')[0];
    const nameStandardForm = name.normalize('NFKD').replace(/[^\w]/g, '')
    const nameConvert = nameStandardForm.replace(/\s+/g, '');
    // const nameConvert = name.replace(/\s+/g, '');
    const extension = path.extname(originalName);
    const dateTime = CommonHelper.formatCurrentTime();
    const keyNameConvert =  `${nameConvert}_${dateTime}${extension.toLowerCase()}`;

    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: dataBuffer,
        Key: keyNameConvert,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline'
      })
      .promise();

    const uploadedFileData = {
      originalName: originalName,
      convertName: uploadResult.Key,
      path: uploadResult.Location,
      extension: extension.toLowerCase(),
    };
    return uploadedFileData;
  }

  static async deleteFile(fileKey) {
    const s3 = new S3();
    const params = { Bucket: process.env.AWS_PUBLIC_BUCKET_NAME, Key: fileKey };
    const deleteResult = await s3.deleteObject(params).promise();
    
    return deleteResult;
  }
}

export default AWSService;
