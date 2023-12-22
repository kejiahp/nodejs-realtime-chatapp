import { Request, Response } from "express";

import { tryCatch } from "../utils/tryCatch";
import { userSearchService } from "./user.service";

export class UserController {
  public getAllUsers = tryCatch(
    async (req: Request<{}, {}, {}, { search: string }>, res: Response) => {
      const searchParam = req.query.search;

      const userId = res.locals.user.uid;

      const foundUsers = await userSearchService(searchParam, userId);

      return res.send(foundUsers);
    }
  );
}
