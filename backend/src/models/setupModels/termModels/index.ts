import { addModel, importModel } from "./add";
import { getModel } from "./get";
import { getAllModel } from "./getAll";
import { removeModel } from "./remove";
import { updateModel } from "./update";
import { importRowsModel } from "./importRows";
import {
  getAllByChapterModel,
  getAllByChapterUserModel,
} from "./getAllByChapter";

class TermModel {
  add: typeof addModel;
  imports: typeof importModel;
  importRows: typeof importRowsModel;
  get: typeof getModel;
  getAll: typeof getAllModel;
  getAllByChapter: typeof getAllByChapterModel;
  getAllByChapterUser: typeof getAllByChapterUserModel;
  remove: typeof removeModel;
  update: typeof updateModel;

  constructor() {
    this.add = addModel;
    this.imports = importModel;
    this.importRows = importRowsModel;
    this.get = getModel;
    this.getAll = getAllModel;
    this.remove = removeModel;
    this.update = updateModel;
    this.getAllByChapter = getAllByChapterModel;
    this.getAllByChapterUser = getAllByChapterUserModel;
  }
}

export default new TermModel();
