import { getByFields } from "./getByFields";
import { getById } from "./getById";
import { getByIdAndQuery } from "./getByIdAndQuery";
import { getByQuery } from "./getByQuery";
import { getByTable } from "./getByTable";

class GetService {
    byFields: typeof getByFields;
    byId: typeof getById;
    byQuery: typeof getByQuery;
    byTable: typeof getByTable;
    byIdAndQuery: typeof getByIdAndQuery;

    constructor() {
        this.byFields = getByFields;
        this.byId = getById;
        this.byQuery = getByQuery;
        this.byTable = getByTable;
        this.byIdAndQuery = getByIdAndQuery;
    }
}

export default new GetService