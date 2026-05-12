import { TriggerContext } from "@devvit/public-api";
import { getExtendedDevvit } from "devvit-helpers";

export async function filterContent (context: TriggerContext, opts: { itemId: string; reason: string; keep?: boolean }) {
    await getExtendedDevvit().redditAPIPlugins.Moderation.Filter({
        id: opts.itemId,
        reason: opts.reason,
        keep: opts.keep ?? false,
    }, context.metadata);
}
