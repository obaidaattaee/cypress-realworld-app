///<reference path="types.ts" />

import express from "express";
//import _ from "lodash";

import {
  getContactsByUsername,
  removeContactById,
  createContactForUser
} from "./database";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import { shortIdValidation } from "./validators";
const router = express.Router();

// Routes
//GET /contacts/:username
router.get("/:username", (req, res) => {
  const { username } = req.params;

  const contacts = getContactsByUsername(username);

  res.status(200);
  res.json({ contacts });
});

//POST /contacts (scoped-user)
router.post(
  "/",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("contact_user_id")]),
  (req, res) => {
    const { contact_user_id } = req.body;

    const contact = createContactForUser(req.user?.id!, contact_user_id);

    res.status(200);
    res.json({ contact });
  }
);
//DELETE /contacts/:contact_id (scoped-user)
router.delete(
  "/:contact_id",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("contact_id")]),
  (req, res) => {
    const { contact_id } = req.params;

    const contacts = removeContactById(contact_id);

    res.status(200);
    res.json({ contacts });
  }
);

export default router;
