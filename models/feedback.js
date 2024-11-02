const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/feedbackDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

    const feedbackSchema = new mongoose.Schema({
        studentName: { type: String, required: true },
        rollNo: { type: String, required: true },
        phone: { type: String }, // Not required
        email: { type: String }, // Not required
        parentName: { type: String, required: true },
        parentPhone: { type: String, required: true },
        parentEmail: { type: String, required: true },
        studentPerformance: { type: String },
        studentComments: { type: String },
        teacherAbility: { type: String },
        teacherComments: { type: String },
        collegeFacilities: { type: String },
        collegeComments: { type: String },
        attendance: { type: String },
        performance: { type: String },
        facultyInteraction: { type: String, required: true }, // Required
        examinationProcess: { type: String, required: true }, // Required
        feeStructure: { type: String, required: true }, // Required
        resultSatisfaction: { type: String, required: true }, // Required
        cleanliness: { type: String },
        cleanlinessComments: { type: String }
    });
    
module.exports = mongoose.model('feedback' , feedbackSchema);