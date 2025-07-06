const mongoose = require('mongoose');

// Job Schema
const  jobSchema = new mongoose.Schema({  // this is the schema for the job model 
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        required: true,
    },
    requirements: [String],
    responsibilities: [String],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
     isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

// Export the Job model
module.exports = mongoose.model("Job", jobSchema);

