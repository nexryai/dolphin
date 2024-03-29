import config from "../../../config";
import { ILocalUser, IRemoteUser } from "../../../models/entities/user";

export default (blocker: ILocalUser, blockee: IRemoteUser) => ({
    type: "Block",
    actor: `${config.url}/users/${blocker.id}`,
    object: blockee.uri
});
