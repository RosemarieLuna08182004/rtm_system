import { addModel } from "./add";
import { getModel } from "./get";
import { getAllModel } from "./getAll";
import { removeModel } from "./remove";
import { updateModel } from "./update";
import { updateByConditionModel } from "./updateByCondition";
class UserLineModel {
  add: typeof addModel;
  get: typeof getModel;
  getAll: typeof getAllModel;
  remove: typeof removeModel;
  update: typeof updateModel;
  updateByCondition: typeof updateByConditionModel;

  constructor() {
      this.add = addModel;
      this.get = getModel;
      this.getAll = getAllModel;
      this.remove = removeModel;
      this.update = updateModel;
      this.updateByCondition = updateByConditionModel;
  }
}

export default new UserLineModel