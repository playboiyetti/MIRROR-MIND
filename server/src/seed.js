const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Category = require('./models/Category');
const Question = require('./models/Question');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Category.deleteMany();
        await Question.deleteMany();

        console.log('Existing data cleared.');

        const questionsBasePath = path.join(__dirname, '../../docs/questions');
        const projectSpecPath = path.join(__dirname, '../../docs/project_specification.json');

        // Load categories from project specification
        const spec = JSON.parse(fs.readFileSync(projectSpecPath, 'utf-8'));
        const categories = spec.questionsDatabase.categories;

        for (const cat of categories) {
            await Category.create({
                id: cat.id,
                name: cat.name,
                themeColor: cat.themeColor,
                description: cat.description
            });
            console.log(`Category seeded: ${cat.name}`);

            // Load questions for this category
            const catPath = path.join(questionsBasePath, cat.id, 'data.json');
            if (fs.existsSync(catPath)) {
                const catData = JSON.parse(fs.readFileSync(catPath, 'utf-8'));
                for (const q of catData.questions) {
                    await Question.create({
                        id: q.id,
                        categoryId: cat.id,
                        front: q.front,
                        back: q.back,
                        intensity: q.intensity || 1
                    });
                }
                console.log(`  ${catData.questions.length} questions seeded.`);
            }
        }

        console.log('Data Seeding Completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
