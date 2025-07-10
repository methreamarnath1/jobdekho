const express = require('express');
const Job = require('../models/Job');
const {auth,authorize} = require('../middleware/auth');
const router = express.Router();


//get all jobs (with filters and pagination)

router.get('/', async (req, res) => {
    try {
    let {
        page = 1,
        limit = 10,
        search,
        location,
        jobType,
        skills
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter ={isActive: true};
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    if (location) {
        filter.location = { $regex: location, $options: 'i' };
    }
    if (jobType) {
        filter.jobType =  jobType;
    }
    if (skills) {
        const skillsArray = skills.split(',').map(skill => skill.trim());
        filter.skills = { $in: skillsArray };
    }
const jobs = await Job.find(filter)
.populate('postedBy', 'firstName lastName ')
.sort({ createdAt: -1 })
.limit(limit * 1)
.skip((page - 1) * limit);

const total = await Job.countDocuments(filter);
 
res.json({
    success: true,
    jobs,
    pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalJobs: total
    },
});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });

}
});


//get job by id
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'firstName lastName');
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}); 
