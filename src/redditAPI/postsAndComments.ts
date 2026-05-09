import { Comment, Post, RedditAPIClient } from "@devvit/public-api";
import { isCommentId, isLinkId } from "@devvit/public-api/types/tid.js";

export function getPostOrCommentById (reddit: RedditAPIClient, thingId: string): Promise<Post | Comment> {
    if (isCommentId(thingId)) {
        return reddit.getCommentById(thingId);
    } else if (isLinkId(thingId)) {
        return reddit.getPostById(thingId);
    } else {
        throw new Error(`Invalid thingId ${thingId}`);
    }
}
