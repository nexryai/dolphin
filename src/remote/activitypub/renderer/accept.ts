import config from "../../../config";
import { ILocalUser } from "../../../models/entities/user";

export default (object: any, user: ILocalUser) => ({
    type: "Accept",
    actor: `${config.url}/users/${user.id}`,
    object
});
