import { addRecord }from './addRecord'
import { addRecords }from './addRecords'

class AddService {
    record: typeof addRecord;
    records: typeof addRecords;

    constructor() {
        this.record = addRecord;
        this.records = addRecords;
    }
}

export default new AddService