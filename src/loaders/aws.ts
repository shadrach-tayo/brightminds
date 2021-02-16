import aws from 'aws-sdk';

function awsLoader() {
  aws.config.setPromisesDependency(null);
  return aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_STORAGE_REGION,
  });
}

export default awsLoader;
