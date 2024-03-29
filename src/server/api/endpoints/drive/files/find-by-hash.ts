import $ from "cafy";
import define from "../../../define";
import { DriveFiles } from "../../../../../models";

export const meta = {
    desc: {
        "ja-JP": "与えられたMD5ハッシュ値を持つファイルを取得します。",
    },

    tags: ["drive"],

    requireCredential: true,

    kind: "read:drive",

    params: {
        md5: {
            validator: $.str,
            desc: {
                "ja-JP": "ファイルのMD5ハッシュ"
            }
        }
    },

    res: {
        type: "array" as const,
        optional: false as const, nullable: false as const,
        items: {
            type: "object" as const,
            optional: false as const, nullable: false as const,
            ref: "DriveFile",
        }
    },
};

export default define(meta, async (ps, user) => {
    const files = await DriveFiles.find({
        md5: ps.md5,
        userId: user.id,
    });

    return await DriveFiles.packMany(files, { self: true });
});
