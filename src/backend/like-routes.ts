///<reference path="types.ts" />

import express from "express";
import { getLikesByTransactionId, createLike } from "./database";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import { shortIdValidation } from "./validators";
const router = express.Router();

// Routes

//GET /likes/:transactionId
router.get(
  "/:transactionId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("transactionId")]),
  (req, res) => {
    const { transactionId } = req.params;
    const likes = getLikesByTransactionId(transactionId);

    res.status(200);
    res.json({ likes });
  }
);

//POST /likes/:transactionId
router.post(
  "/:transactionId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("transactionId")]),
  (req, res) => {
    const { transactionId } = req.params;

    const like = createLike(req.user?.id!, transactionId);

    res.status(200);
    res.json({ like });
  }
);

export default router;
