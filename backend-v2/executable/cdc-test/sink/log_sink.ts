import { Sink } from '../sink';
import { createClient } from 'redis';
class LogSink implements Sink {
  redisClient: ReturnType<typeof createClient>;
  constructor(redisClient: ReturnType<typeof createClient>) {
    this.redisClient = redisClient;
  }
  async save(data: any): Promise<void> {
    const sinkData = data.sinkData;
    const post = sinkData.fullDocument;
    const {folowers} = sinkData;
    console.log(`New post: ${post.title}`);
    console.log(`Folowers: ${folowers}`);
    const dateTime = (new Date(sinkData.fullDocument.createdAt)).getTime();
    const pipeline = this.redisClient.multi();
    for(const follower of folowers) {
      pipeline.zAdd(
        `posts:${follower}`,
        {
          score: dateTime,
          value: JSON.stringify(post),
        }
      );
    }
    await pipeline.exec();
  }
}

export {
  LogSink,
};
