// import { Request, Response, NextFunction } from "express";
// import { Add, Update, Remove, Get } from "./../services";

// export const serviceHandler = {
//   async add(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { table, fields, data } = req.body;
//       const result = await Add.record(table, fields, data);
//       if (!result) return res.status(400).json({ success: false, message: "Failed to add record" });
//       return res.status(200).json({ success: true, message: "Record added successfully" });
//     } catch (error) {
//       next(error);
//     }
//   },

//   async update(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { id, table, fields, data } = req.body;
//       const result = await Update.record(id, table, fields, data);
//       if (!result) return res.status(400).json({ success: false, message: "Failed to update record" });
//       return res.status(200).json({ success: true, message: "Record updated successfully" });
//     } catch (error) {
//       next(error);
//     }
//   },

//   async delete(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { table, id } = req.body;
//       const result = await Remove.byId(table, id);
//       if (!result) return res.status(400).json({ success: false, message: "Failed to delete record" });
//       return res.status(200).json({ success: true, message: "Record deleted successfully" });
//     } catch (error) {
//       next(error);
//     }
//   },

// //   async get(req: Request, res: Response, next: NextFunction) {
// //     try {
// //       const { table, id } = req.params;
// //       const result = await Get.byId(table, id);
// //       if (!result) return res.status(404).json({ success: false, message: "Record not found" });
// //       return res.status(200).json({ success: true, data: result });
// //     } catch (error) {
// //       next(error);
// //     }
// //   },

// //   async getAll(req: Request, res: Response, next: NextFunction) {
// //     try {
// //       const { table } = req.params;
// //       const result = await GetAll.records(table);
// //       return res.status(200).json({ success: true, data: result });
// //     } catch (error) {
// //       next(error);
// //     }
// //   }
// };
