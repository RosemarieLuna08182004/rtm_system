import {removeByFields} from './removeByFields'
import { removeById } from './removeById'

class RemoveService {
    byId: typeof removeById;
    byFields: typeof removeByFields;

    constructor() {
        this.byId = removeById;
        this.byFields = removeByFields;
    }
}

export default new RemoveService