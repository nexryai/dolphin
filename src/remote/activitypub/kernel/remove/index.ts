import { IRemoteUser } from "../../../../models/entities/user";
import { IRemove } from "../../type";
import { resolveNote } from "../../models/note";
import { removePinned } from "../../../../services/i/pin";

export default async (actor: IRemoteUser, activity: IRemove): Promise<void> => {
    if ("actor" in activity && actor.uri !== activity.actor) {
        throw new Error("invalid actor");
    }

    if (activity.target == null) {
        throw new Error("target is null");
    }

    if (activity.target === actor.featured) {
        const note = await resolveNote(activity.object);
        if (note == null) throw new Error("note not found");
        await removePinned(actor, note.id);
        return;
    }

    throw new Error(`unknown target: ${activity.target}`);
};
