import config from "../../../config";
import { User, ILocalUser } from "../../../models/entities/user";
import { Users } from "../../../models";

export default (mention: User) => ({
    type: "Mention",
    href: Users.isRemoteUser(mention) ? mention.uri : `${config.url}/users/${(mention as ILocalUser).id}`,
    name: Users.isRemoteUser(mention) ? `@${mention.username}@${mention.host}` : `@${(mention as ILocalUser).username}`,
});
