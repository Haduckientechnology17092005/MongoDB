import {config} from 'dotenv';
import mongoose from 'mongoose';
import { Pipeline} from './pipeline';
import { PostSource } from './source/post_source';
import { LogSink } from './sink/log_sink';
import { createClient } from 'redis';
config();

async function connectMongoDB() {
  await mongoose.connect(process.env.MONGO_URI);
}

async function main() {
  await connectMongoDB();
  const source = new PostSource();
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  const sink = new LogSink(redisClient);

  const pipline = new Pipeline(source, sink, []);

  await pipline.run();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});