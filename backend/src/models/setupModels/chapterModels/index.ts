import { addModel } from "./add";
import { getModel } from "./get";
import { getAllModel } from "./getAll";
import { getAllWithStatus } from "./getAllWithStatus";
import { removeModel } from "./remove";
import { updateModel } from "./update";

class ChapterModel {
  add: typeof addModel;
  get: typeof getModel;
  getAll: typeof getAllModel;
  getAllWithStatus: typeof getAllWithStatus;
  remove: typeof removeModel;
  update: typeof updateModel;

  constructor() {
    this.add = addModel;
    this.get = getModel;
    this.getAll = getAllModel;
    this.getAllWithStatus = getAllWithStatus;
    this.remove = removeModel;
    this.update = updateModel;
  }
}

export default new ChapterModel();
