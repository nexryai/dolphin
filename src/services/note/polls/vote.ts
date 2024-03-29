import { publishNoteStream } from "../../stream";
import { User } from "../../../models/entities/user";
import { Note } from "../../../models/entities/note";
import { PollVotes, Polls } from "../../../models";
import { genId } from "../../../misc/gen-id";
import { createNotification } from "../../create-notification";

export default async function(user: User, note: Note, choice: number) {
    const poll = await Polls.findOne(note.id);

    if (poll == null) throw new Error("poll not found");

    // Check whether is valid choice
    if (poll.choices[choice] == null) throw new Error("invalid choice param");

    // if already voted
    const exist = await PollVotes.find({
        noteId: note.id,
        userId: user.id
    });

    if (poll.multiple) {
        if (exist.some(x => x.choice === choice)) {
            throw new Error("already voted");
        }
    } else if (exist.length !== 0) {
        throw new Error("already voted");
    }

    // Create vote
    await PollVotes.save({
        id: genId(),
        createdAt: new Date(),
        noteId: note.id,
        userId: user.id,
        choice: choice
    });

    // Increment votes count
    const index = choice + 1; // In SQL, array index is 1 based
    await Polls.query(`UPDATE poll SET votes[${index}] = votes[${index}] + 1 WHERE "noteId" = '${poll.noteId}'`);

    publishNoteStream(note.id, "pollVoted", {
        choice: choice,
        userId: user.id
    });

    // Notify
    createNotification(note.userId, user.id, "pollVote", {
        noteId: note.id,
        choice: choice
    });
}
