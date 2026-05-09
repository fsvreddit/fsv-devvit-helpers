import { RedditAPIClient, User } from "@devvit/public-api";

export async function getUserOrUndefined (username: string, reddit: RedditAPIClient) {
    let user: User | undefined;
    try {
        user = await reddit.getUserByUsername(username);
    } catch {
        //
    }

    return user;
}
