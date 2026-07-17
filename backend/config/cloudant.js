const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');
const logger = require('morgan');

if (!process.env.CLOUDANT_URL || !process.env.CLOUDANT_APIKEY) {
    console.error('CRITICAL ERROR: Cloudant environment configurations are missing!');
    process.exit(1);
}

const authenticator = new IamAuthenticator({
    apikey: process.env.CLOUDANT_APIKEY,
});

const cloudant = CloudantV1.newInstance({
    authenticator: authenticator,
});
cloudant.setServiceUrl(process.env.CLOUDANT_URL);

const DB_USERS = 'tasksphere-users';
const DB_TASKS = 'tasksphere-tasks';

async function initializeDatabase(dbName) {
    try {
        await cloudant.putDatabase({ db: dbName });
        console.log(`Database "${dbName}" created successfully or verified.`);
    } catch (err) {
        if (err.code === 412) {
            console.log(`Database "${dbName}" already exists.`);
        } else {
            console.error(`Error initializing database "${dbName}":`, err);
            throw err;
        }
    }
}

async function createDesignDocsAndIndexes() {
    try {
        // User query index
        await cloudant.postIndex({
            db: DB_USERS,
            index: { fields: ['email'] },
            name: 'users-email-index'
        });

        // Task multi-lookup structural index
        await cloudant.postIndex({
            db: DB_TASKS,
            index: { fields: ['userId', 'status', 'priority', 'dueDate'] },
            name: 'tasks-composite-index'
        });
        console.log('IBM Cloudant system design documents and indexes synced.');
    } catch (err) {
        console.error('Failed syncing cloudant design documents:', err);
    }
}

async function connectCloudant() {
    await initializeDatabase(DB_USERS);
    await initializeDatabase(DB_TASKS);
    await createDesignDocsAndIndexes();
}

connectCloudant().catch(err => {
    console.error('Fatal initialization error binding to IBM Cloudant SaaS:', err);
});

module.exports = {
    cloudant,
    DB_USERS,
    DB_TASKS
};