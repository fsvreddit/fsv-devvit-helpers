import { RedisClient } from "@devvit/public-api";

export async function mGetAsRecord (redis: RedisClient, keys: string[]): Promise<Record<string, string>> {
    const results = await redis.mGet(keys);
    const record: Record<string, string> = {};

    keys.forEach((key, index) => {
        const value = results[index];
        if (value !== null) {
            record[key] = value;
        }
    });

    return record;
}
