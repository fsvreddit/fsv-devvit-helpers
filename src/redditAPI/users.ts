import { RedditAPIClient, User } from "@devvit/public-api";
import { getPostOrCommentById } from "./postsAndComments";

export async function getUserOrUndefined (username: string, reddit: RedditAPIClient) {
    let user: User | undefined;
    try {
        user = await reddit.getUserByUsername(username);
    } catch {
        //
    }

    return user;
}

export async function getTrueUsername (reddit: RedditAPIClient, username: string, targetId: string): Promise<string> {
    if (username !== "[redacted]") {
        return username;
    }

    const target = await getPostOrCommentById(reddit, targetId);
    console.warn(`Content Creation: Author is redacted, true username for ${targetId} is ${target.authorName}`);
    return target.authorName;
}
