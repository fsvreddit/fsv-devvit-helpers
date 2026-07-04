import { PostSubmit, CommentSubmit, PostCreate, CommentCreate, PostUpdate, CommentUpdate } from "@devvit/protos";
import { Comment, Post, RedditAPIClient, TriggerContext } from "@devvit/public-api";
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

export async function fixPostTriggerEvent<T extends PostSubmit | PostCreate | PostUpdate> (event: T, context: TriggerContext): Promise<T> {
    const eventToReturn: T = { ...event };

    if (!eventToReturn.post || !eventToReturn.author) {
        return eventToReturn;
    }

    if (eventToReturn.author.name !== "[redacted]" && eventToReturn.post.selftext !== "[Removed by Reddit]") {
        return eventToReturn;
    }

    const post = await context.reddit.getPostById(eventToReturn.post.id);

    if (post.body !== undefined) {
        eventToReturn.post.selftext = post.body;
    }

    eventToReturn.author.name = post.authorName;
    if (post.authorId) {
        eventToReturn.author.id = post.authorId;
    }

    return eventToReturn;
}

export async function fixCommentTriggerEvent<T extends CommentSubmit | CommentCreate | CommentUpdate> (event: T, context: TriggerContext): Promise<T> {
    const eventToReturn: T = { ...event };

    if (!eventToReturn.comment || !eventToReturn.author) {
        return eventToReturn;
    }

    if (eventToReturn.author.name !== "[redacted]" && eventToReturn.comment.body !== "[Removed by Reddit]") {
        return eventToReturn;
    }

    const comment = await context.reddit.getCommentById(eventToReturn.comment.id);

    eventToReturn.comment.body = comment.body;

    eventToReturn.author.name = comment.authorName;
    if (comment.authorId) {
        eventToReturn.author.id = comment.authorId;
    }

    return eventToReturn;
}
