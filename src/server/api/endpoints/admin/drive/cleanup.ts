import { IsNull } from "typeorm";
import define from "../../../define";
import { deleteFile } from "../../../../../services/drive/delete-file";
import { DriveFiles } from "../../../../../models";

export const meta = {
    tags: ["admin"],

    requireCredential: true,
    requireModerator: true,
};

export default define(meta, async (ps, me) => {
    const files = await DriveFiles.find({
        userId: IsNull(),
        ownedBySystem: false
    });

    for (const file of files) {
        deleteFile(file);
    }
});
