const { cloudant, DB_TASKS } = require('../config/cloudant');
const { v4: uuidv4 } = require('uuid');

exports.getAllTasks = async (req, res) => {
    const { search, priority, status, category, sortBy } = req.query;
    try {
        let selector = { userId: req.user.id };

        if (priority) selector.priority = priority;
        if (status) selector.status = status;
        if (category) selector.category = category;
        if (search) {
            selector.title = { "$regex": `(?i)${search}` };
        }

        const findResponse = await cloudant.postFind({
            db: DB_TASKS,
            selector: selector,
            limit: 200
        });

        let tasks = findResponse.result.docs;

        if (sortBy === 'dueDate') {
            tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } else {
            tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Cloudant functional read routine exception.' });
    }
};

exports.createTask = async (req, res) => {
    const { title, description, priority, category, dueDate, estimatedTime, tags } = req.body;
    try {
        const taskId = uuidv4();
        const newTask = {
            _id: taskId,
            userId: req.user.id,
            title,
            description: description || '',
            priority,
            category,
            dueDate,
            status: 'todo',
            estimatedTime: estimatedTime || 0,
            tags: tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const response = await cloudant.postDocument({ db: DB_TASKS, document: newTask });
        res.status(201).json({ ...newTask, _rev: response.result.rev });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not provision new structural document object.' });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    try {
        const taskResponse = await cloudant.getDocument({ db: DB_TASKS, docId: id });
        let taskDoc = taskResponse.result;

        if (taskDoc.userId !== req.user.id) {
            return res.status(403).json({ message: 'Resource security violation.' });
        }

        const updates = req.body;
        delete updates._id;
        delete updates.userId;

        taskDoc = { ...taskDoc, ...updates, updatedAt: new Date().toISOString() };

        const response = await cloudant.postDocument({ db: DB_TASKS, document: taskDoc });
        res.json({ ...taskDoc, _rev: response.result.rev });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Cloudant atomic update verification failure.' });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const taskResponse = await cloudant.getDocument({ db: DB_TASKS, docId: id });
        const taskDoc = taskResponse.result;

        if (taskDoc.userId !== req.user.id) {
            return res.status(403).json({ message: 'Resource security violation.' });
        }

        await cloudant.deleteDocument({
            db: DB_TASKS,
            docId: id,
            rev: taskDoc._rev
        });

        res.json({ message: 'Resource successfully purged from cloud array.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Cloudant structural delete operational failure.' });
    }
};

exports.patchStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const taskResponse = await cloudant.getDocument({ db: DB_TASKS, docId: id });
        let taskDoc = taskResponse.result;

        if (taskDoc.userId !== req.user.id) {
            return res.status(403).json({ message: 'Resource security violation.' });
        }

        taskDoc.status = status;
        taskDoc.updatedAt = new Date().toISOString();

        const response = await cloudant.postDocument({ db: DB_TASKS, document: taskDoc });
        res.json({ ...taskDoc, _rev: response.result.rev });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Cloudant structural patching routine crash.' });
    }
};

exports.duplicateTask = async (req, res) => {
    const { id } = req.params;
    try {
        const taskResponse = await cloudant.getDocument({ db: DB_TASKS, docId: id });
        const sourceTask = taskResponse.result;

        if (sourceTask.userId !== req.user.id) {
            return res.status(403).json({ message: 'Resource routing execution rejected.' });
        }

        const newId = uuidv4();
        const duplicatedTask = {
            ...sourceTask,
            _id: newId,
            title: `${sourceTask.title} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        delete duplicatedTask._rev;

        const response = await cloudant.postDocument({ db: DB_TASKS, document: duplicatedTask });
        res.status(201).json({ ...duplicatedTask, _rev: response.result.rev });
    } catch (err) {
        res.status(500).json({ message: 'Duplication engine state compilation failure.' });
    }
};