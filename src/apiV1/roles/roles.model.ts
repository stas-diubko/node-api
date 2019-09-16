import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const RolesSchema = Schema(
    {
        users: {
            type: Array
        },
        admins: {
            type: Array
        }
    }
)

export default mongoose.model("Roles", RolesSchema);
