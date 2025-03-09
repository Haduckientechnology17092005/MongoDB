import {config} from 'dotenv';
import path from 'path';
config({ path: path.join(process.cwd(), '.env') });
import {createHttpServer} from './app';
import mongoose from 'mongoose';
import env from './utils/env';
import { PostSource } from '../cdc-test/source/post_source';
import { LogSink } from '../cdc-test/sink/log_sink';
import { Operator, Pipeline } from '../cdc-test/pipeline';
import { connectRedis } from '../../lib/redis';
import {GetFollowers} from '../cdc-test/operator/get_followers';
async function start() {
    await mongoose.connect(env.MONGO_URI);
    const redisClient = await connectRedis();
    const server = createHttpServer(redisClient);

    const postSource = new PostSource();
    const logSink = new LogSink(redisClient);
    const operators: Operator[] = [];
    operators.push(new GetFollowers(postSource, logSink));
    const pipeline = new Pipeline(postSource, logSink, operators);
    await pipeline.run();
    
    server.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });

    process.on('SIGINT', () => {
        // redisClient.quit();

        // Avoid connection leak.
        mongoose.connection.close();
        process.exit(0);
    });
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
});