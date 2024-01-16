const query = require("../db/connect");
const { randomUUID } = require("crypto");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

const getAllTasks = asyncWrapper(async (req, res, next) => {
  const tasks = await query(`SELECT * FROM tasks ORDER BY id DESC`);
  res.status(201).json({ tasks });
});

const createTask = asyncWrapper(async (req, res, next) => {
  const { name, completed } = req.body;

  if (name === undefined || name === "") return next(createCustomError(`Nama wajib dimasukkan`, 400));
  if (name.length > 40) return next(createCustomError(`Nama tidak bisa lebih dari 40 karakter`, 400));

  await query(`INSERT INTO tasks (uuid, name, completed) VALUES (?, ?, ?);`, [randomUUID(), name, completed]);
  res.status(201).json({ msg: "Data berhasil dimasukkan" });
});

const getTask = asyncWrapper(async (req, res, next) => {
  const { uuid: taskID } = req.params;
  const task = await query(`SELECT * FROM tasks WHERE uuid = ?`, [taskID]);

  if (task.length === 0) {
    return next(createCustomError(`Tidak ada task dengan id = ${taskID}`, 404));
  }

  res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res, next) => {
  const { uuid: taskID } = req.params;
  const task = await query(`SELECT * FROM tasks WHERE uuid = ?`, [taskID]);

  if (task.length === 0) {
    return next(createCustomError(`Tidak ada task dengan id = ${taskID}`, 404));
  }

  await query(`DELETE FROM tasks WHERE uuid = ?`, [taskID]);
  res.status(200).json({ task, msg: "Data berhasil dihapus" });
});

const updateTask = asyncWrapper(async (req, res, next) => {
  const { uuid: taskID } = req.params;
  let { name, completed } = req.body;

  const task = await query(`SELECT * FROM tasks WHERE uuid = ?`, [taskID]);

  if (task.length === 0) {
    return next(createCustomError(`Tidak ada task dengan id = ${taskID}`, 404));
  }

  if (completed === undefined) {
    value = await query(`SELECT completed FROM tasks WHERE uuid = ?`, [taskID]);
    completed = value[0].completed;
  }

  if (name === undefined || name === "") return next(createCustomError(`Nama wajib dimasukkan`, 400));
  if (name.length > 40) return next(createCustomError(`Nama tidak bisa lebih dari 40 karakter`, 400));

  await query(`UPDATE tasks SET name = ?, completed = ? WHERE uuid = ?`, [name, completed, taskID]);
  res.status(200).json({ task: { uuid: taskID, name, completed }, msg: "Data berhasil diubah" });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
