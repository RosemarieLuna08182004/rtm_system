import { addModel } from "./add";
import { getModel } from "./get";
import { getAllModel, getAllCountsModel } from "./getAll";
import { removeModel } from "./remove";
import { updateModel } from "./update";

class SalesModel {
  add: typeof addModel;
  get: typeof getModel;
  getAll: typeof getAllModel;
  getAllCount: typeof getAllCountsModel;
  remove: typeof removeModel;
  update: typeof updateModel;

  constructor() {
    this.add = addModel;
    this.get = getModel;
    this.getAll = getAllModel;
    this.getAllCount = getAllCountsModel;
    this.remove = removeModel;
    this.update = updateModel;
  }
}

export default new SalesModel();
