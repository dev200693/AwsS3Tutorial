// Import the 'express' module
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { PutObjectCommand, ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";


dotenv.config();
//Please provide your file.Otherwise this line will fail.
const sampleFilePath = path.join(__dirname, '..', 'sample.txt');

const client = new S3Client({
    region: 'eu-north-1',
    credentials: {
        accessKeyId: process.env.accesskeyid!,
        secretAccessKey: process.env.secretaccesskey!
    }
});

const app = express();
app.get('/', (req: Request, res: Response) => {
    res.status(200).send({
        isSuccess: true
    })
});

app.get("/test/upload", async (req: Request, res: Response) => {
    uploadFile();
    res.status(200).send({ isSuccess: true, message: "File Uploaded successfully" })
});
app.get("/test/list", async (req: Request, res: Response) => {
    const response = await listObjects();
    const { isSuccess, message, data } = response;
    res.status(200).send({ isSuccess, message, data })
});

app.listen(3001, () => {
    console.log('SERVER LISTENING AT 3001')
});

const uploadFile = async (): Promise<{ isSuccess: boolean, message: string }> => {
    const command = new PutObjectCommand({
        Bucket: "s3tutorialecorp",
        Key: 'sample2.txt',
        Body: sampleFilePath
    });

    try {
        const response = await client.send(command);
        console.log(response);
        return { isSuccess: true, message: 'File upload success' }
    } catch (err) {
        console.error(err);
        return { isSuccess: false, message: 'File upload failure' }
    }
}

const listObjects = async (): Promise<{ isSuccess: boolean, message: string, data: unknown }> => {
    const command = new ListObjectsCommand({
        Bucket: "s3tutorialecorp",
    });

    try {
        const response = await client.send(command);
        console.log(response);
        return { isSuccess: true, message: 'List bucket object success', data: response }
    } catch (err) {
        console.error(err);
        return { isSuccess: false, message: 'List bucket object failure', data: null }
    }
}