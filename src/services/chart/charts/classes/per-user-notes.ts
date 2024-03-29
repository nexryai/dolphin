import autobind from "autobind-decorator";
import Chart, { Obj, DeepPartial } from "../../core";
import { User } from "../../../../models/entities/user";
import { SchemaType } from "../../../../misc/schema";
import { Notes } from "../../../../models";
import { Note } from "../../../../models/entities/note";
import { name, schema } from "../schemas/per-user-notes";

type PerUserNotesLog = SchemaType<typeof schema>;

export default class PerUserNotesChart extends Chart<PerUserNotesLog> {
    constructor() {
        super(name, schema, true);
    }

	@autobind
    protected genNewLog(latest: PerUserNotesLog): DeepPartial<PerUserNotesLog> {
        return {
            total: latest.total,
        };
    }

	@autobind
	protected async fetchActual(group: string): Promise<DeepPartial<PerUserNotesLog>> {
	    const [count] = await Promise.all([
	        Notes.count({ userId: group }),
	    ]);

	    return {
	        total: count,
	    };
	}

	@autobind
	public async update(user: User, note: Note, isAdditional: boolean) {
	    const update: Obj = {
	        diffs: {}
	    };

	    update.total = isAdditional ? 1 : -1;

	    if (isAdditional) {
	        update.inc = 1;
	    } else {
	        update.dec = 1;
	    }

	    if (note.replyId != null) {
	        update.diffs.reply = isAdditional ? 1 : -1;
	    } else if (note.renoteId != null) {
	        update.diffs.renote = isAdditional ? 1 : -1;
	    } else {
	        update.diffs.normal = isAdditional ? 1 : -1;
	    }

	    await this.inc(update, user.id);
	}
}
