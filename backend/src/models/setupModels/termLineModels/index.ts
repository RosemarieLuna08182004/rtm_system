import { addModel } from "./add";
import { getModel } from "./get";
import { getAllModel } from "./getAll";
import { getAllByTermModel } from "./getAllByTerm";
import { removeModel } from "./remove";
import { updateModel } from "./update";

class TermLineModel {
  add: typeof addModel;
  get: typeof getModel;
  getAll: typeof getAllModel;
  remove: typeof removeModel;
  update: typeof updateModel;
  getAllByTerm: typeof getAllByTermModel
  constructor() {
      this.add = addModel;
      this.get = getModel;
      this.getAll = getAllModel;
      this.remove = removeModel;
      this.update = updateModel;
      this.getAllByTerm = getAllByTermModel;
  }
}

export default new TermLineModel