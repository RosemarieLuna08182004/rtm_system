import { updateRecord } from "./updateRecord";
import { updateByCondition } from "./updateByCondition";

class UpdateService {
    record: typeof updateRecord;
    condition: typeof updateByCondition;

    constructor() {
        this.record = updateRecord;
        this.condition = updateByCondition;
    }
}

export default new UpdateService