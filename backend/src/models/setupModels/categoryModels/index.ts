import { addModel } from "./add";
import { getModel } from "./get";
import { getAllModel } from "./getAll";
import { removeModel } from "./remove";
import { updateModel } from "./update";

class CategoryModel {
  add: typeof addModel;
  get: typeof getModel;
  getAll: typeof getAllModel;
  remove: typeof removeModel;
  update: typeof updateModel;

  constructor() {
      this.add = addModel;
      this.get = getModel;
      this.getAll = getAllModel;
      this.remove = removeModel;
      this.update = updateModel;

  }
}

export default new CategoryModel