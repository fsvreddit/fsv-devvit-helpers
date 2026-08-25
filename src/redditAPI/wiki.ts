import { TriggerContext, UpdateWikiPageOptions, WikiPage } from "@devvit/public-api";
import { marked } from "marked";

export async function updateWikiPageMulti (options: UpdateWikiPageOptions, context: TriggerContext): Promise<WikiPage> {
    const isV2WikiEnabled = await context.reddit.isWikiV2Enabled(context.subredditName ?? await context.reddit.getCurrentSubredditName());

    const promises: Promise<WikiPage>[] = [
        context.reddit.updateWikiPage({
            ...options,
            wikiVersion: "v1",
        }),
    ];

    if (isV2WikiEnabled) {
        const contentHtml = await Promise.resolve(marked(options.content));
        promises.push(context.reddit.updateWikiPage({
            ...options,
            content: contentHtml,
            wikiVersion: "v2",
        }));
    }

    return Promise.all(promises).then(results => results[0]);
}
