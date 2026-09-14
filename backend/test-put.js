const mongoose = require('mongoose');
const { Task } = require('./src/models/Task');

async function test() {
    try {
        await mongoose.connect('mongodb+srv://sairohi2027_db_user:Todoapp@cluster0.kfndv30.mongodb.net/Todo?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connected to MongoDB');

        // Find any task
        const task = await Task.findOne();
        if (!task) {
            console.log('No task found');
            process.exit(0);
        }

        console.log('Found task:', task.title, 'Completed:', task.completed);

        // Try to update completed status
        task.completed = !task.completed;
        console.log('Saving task with new completed status:', task.completed);

        await task.save();
        console.log('Task saved successfully!');

    } catch (err) {
        console.error('Error saving task:', err);
    } finally {
        mongoose.disconnect();
    }
}

test();
