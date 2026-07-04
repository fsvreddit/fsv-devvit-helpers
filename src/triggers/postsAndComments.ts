import { PostSubmit, CommentSubmit, PostCreate, CommentCreate, PostUpdate, CommentUpdate } from "@devvit/protos";
import { TriggerContext } from "@devvit/public-api";

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
