const { cloudant, DB_TASKS } = require('../config/cloudant');

exports.getAnalyticsSummary = async (req, res) => {
    try {
        const findResponse = await cloudant.postFind({
            db: DB_TASKS,
            selector: { userId: req.user.id },
            limit: 1000
        });

        const tasks = findResponse.result.docs;
        const now = new Date();

        let metrics = {
            total: tasks.length,
            completed: 0,
            todo: 0,
            inProgress: 0,
            overdue: 0,
            priorityDistribution: { low: 0, medium: 0, high: 0 },
            categoryDistribution: {},
            weeklyCompletionTrend: [
                { day: 'Mon', completed: 0 },
                { day: 'Tue', completed: 0 },
                { day: 'Wed', completed: 0 },
                { day: 'Thu', completed: 0 },
                { day: 'Fri', completed: 0 },
                { day: 'Sat', completed: 0 },
                { day: 'Sun', completed: 0 }
            ]
        };

        tasks.forEach(task => {
            // Count Statuses
            if (task.status === 'completed') metrics.completed++;
            else if (task.status === 'todo') metrics.todo++;
            else if (task.status === 'in-progress') metrics.inProgress++;

            // Count Overdue
            if (task.status !== 'completed' && new Date(task.dueDate) < now) {
                metrics.overdue++;
            }

            // Priorities
            if (metrics.priorityDistribution[task.priority] !== undefined) {
                metrics.priorityDistribution[task.priority]++;
            }

            // Categories
            metrics.categoryDistribution[task.category] = (metrics.categoryDistribution[task.category] || 0) + 1;

            // Simple Weekly Trend Map mapping
            if (task.status === 'completed' && task.updatedAt) {
                const dayIndex = (new Date(task.updatedAt).getDay() + 6) % 7; // Align Mon-Sun
                metrics.weeklyCompletionTrend[dayIndex].completed++;
            }
        });

        res.json(metrics);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Analytics aggregation processor map failed.' });
    }
};

exports.getCalendarMetrics = async (req, res) => {
    try {
        const findResponse = await cloudant.postFind({
            db: DB_TASKS,
            selector: { userId: req.user.id }
        });

        const parsedEvents = findResponse.result.docs.map(task => ({
            id: task._id,
            title: task.title,
            start: new Date(task.dueDate),
            end: new Date(task.dueDate),
            allDay: true,
            resource: { priority: task.priority, status: task.status, category: task.category }
        }));

        res.json(parsedEvents);
    } catch (err) {
        res.status(500).json({ message: 'Calendar event compilation execution failure.' });
    }
};