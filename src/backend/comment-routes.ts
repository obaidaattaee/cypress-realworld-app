///<reference path="types.ts" />

import express from "express";
import { getCommentsByTransactionId, createComment } from "./database";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import { shortIdValidation, isCommentValidator } from "./validators";
const router = express.Router();

// Routes

//GET /comments/:transactionId
router.get(
  "/:transactionId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("transactionId")]),
  (req, res) => {
    const { transactionId } = req.params;
    const comments = getCommentsByTransactionId(transactionId);

    res.status(200);
    res.json({ comments });
  }
);

//POST /comments/:transactionId
router.post(
  "/:transactionId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("transactionId"), isCommentValidator]),
  (req, res) => {
    const { transactionId } = req.params;
    const { content } = req.body;

    const comment = createComment(req.user?.id!, transactionId, content);

    res.status(200);
    res.json({ comment });
  }
);

export default router;
