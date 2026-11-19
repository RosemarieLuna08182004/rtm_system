import { addModel } from "./add";
import { getModel } from "./get";
import { getAllModel } from "./getAll";
import { removeModel } from "./remove";
import { updateModel } from "./update";
import { getByChapter } from "./getByChapter";
import {
  getAllChaptersModel,
  getChapterModel,
  getAllTermsByChapterModel,
  getAllBookmarkModel,
  getTermModel,
  getAllChapterByBookmarkModel
} from "./getAllChapters";

class UserTermsModel {
  add: typeof addModel;
  get: typeof getModel;
  getTerm: typeof getTermModel;
  getAll: typeof getAllModel;
  getAllChapters: typeof getAllChaptersModel;
  getAllBookmark: typeof getAllBookmarkModel;
  getChapter: typeof getChapterModel;
  getAllTermsByChapter: typeof getAllTermsByChapterModel;
  getAllChapterByBookmark: typeof getAllChapterByBookmarkModel;
  getByChapter: typeof getByChapter;
  remove: typeof removeModel;
  update: typeof updateModel;

  constructor() {
    this.add = addModel;
    this.get = getModel;
    this.getTerm = getTermModel;
    this.getAll = getAllModel;
    this.getAllChapters = getAllChaptersModel;
    this.getAllBookmark = getAllBookmarkModel;
    this.getChapter = getChapterModel;
    this.getAllTermsByChapter = getAllTermsByChapterModel;
    this.getAllChapterByBookmark = getAllChapterByBookmarkModel;
    this.getByChapter = getByChapter;
    this.remove = removeModel;
    this.update = updateModel;
  }
}

export default new UserTermsModel();
