import env from '../../utils/env';
import { createClient } from 'redis';

class RedisService {
    private redisClient;
    constructor() {
        this.redisClient = createClient({
            url: env.REDIS_URL,
        });
        this.redisClient.on('error', (err) => {
            console.error(err);
        });
        this.redisClient.connect().then(() => {
            console.log('Connected to Redis');
        }).catch((err) => {
            console.error(err);
        });
    }
    async deleteKey(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
    async setKey(key: string, value: string): Promise<void> {
        await this.redisClient.set(key, value);
    }
    async getKey(key: string): Promise<string> {
        return await this.redisClient.get(key);
    }
    async getRange(key: string, start: number, end: number): Promise<string[]> {
        const posts = await this.redisClient.lrange(key, start, end, {REV: true});
        return posts;
    }
    async addToList(key: string, value: string): Promise<void> {
        await this.redisClient.lpush(key, value);
    }
    async removeFromList(key: string, value: string): Promise<void> {
        await this.redisClient.lrem(key, 0, value);
    }
}
export {
    RedisService,
};
