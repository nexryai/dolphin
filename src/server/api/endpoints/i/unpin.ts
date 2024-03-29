import $ from "cafy";
import { ID } from "../../../../misc/cafy-id";
import { removePinned } from "../../../../services/i/pin";
import define from "../../define";
import { ApiError } from "../../error";
import { Users } from "../../../../models";

export const meta = {
    stability: "stable",

    desc: {
        "ja-JP": "指定した投稿のピン留めを解除します。"
    },

    tags: ["account", "notes"],

    requireCredential: true,

    kind: "write:account",

    params: {
        noteId: {
            validator: $.type(ID),
            desc: {
                "ja-JP": "対象の投稿のID",
                "en-US": "Target note ID"
            }
        }
    },

    errors: {
        noSuchNote: {
            message: "No such note.",
            code: "NO_SUCH_NOTE",
            id: "454170ce-9d63-4a43-9da1-ea10afe81e21"
        },
    }
};

export default define(meta, async (ps, user) => {
    await removePinned(user, ps.noteId).catch(e => {
        if (e.id === "b302d4cf-c050-400a-bbb3-be208681f40c") throw new ApiError(meta.errors.noSuchNote);
        throw e;
    });

    return await Users.pack(user, user, {
        detail: true
    });
});
