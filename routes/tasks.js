const express = require("express");
const router = express.Router();
const { getAllTasks, createTask, getTask, updateTask, deleteTask } = require("../controllers/tasks");

router.route("/").get(getAllTasks);
router.route("/").post(createTask);
router.route("/:uuid").get(getTask);
router.route("/:uuid").patch(updateTask);
router.route("/:uuid").delete(deleteTask);

module.exports = router;