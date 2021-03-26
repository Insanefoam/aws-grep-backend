export type CredentialsDto = {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
};

export type AwsObjectDto = {
  name: string;
  size: number;
  type?: string;
  data?: string;
  lastModified?: string;
};
