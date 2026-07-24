import { RedisClient } from "@devvit/public-api";
import { addDays } from "date-fns";
import { expireKeyAt } from "devvit-helpers";

interface TriggerLockOptions {
    expiration?: Date;
    verboseLogs?: boolean;
}

export async function hasTriggerBeenHandled (redis: RedisClient, identifier: string, opts?: TriggerLockOptions): Promise<boolean> {
    const redisKey = `triggerLock:${identifier}`;
    const expiration = opts?.expiration ?? addDays(new Date(), 1);

    const newVal = await redis.incrBy(redisKey, 1);
    await expireKeyAt(redis, redisKey, expiration);

    return newVal > 1;
}
