const { NotFoundError } = require('../errors')
const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId })
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
    // ★ UPDATED: find → findOne
    const job = await Job.findOne({ _id: req.params.id })   // ← updated
    if (!job) throw new NotFoundError('not found')
    res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
    const job = await Job.findOneAndUpdate(
        {_id: req.params.id }, 
        req.body, 
        {new: true, runValidators: true}
    )
    if (!job) throw new NotFoundError('not found')
    res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
    // ★ UPDATED: find → findOne
    const job = await Job.findOne({ _id: req.params.id })   // ← updated
    if (!job) throw new NotFoundError('not found')

    // ★ UPDATED: deleteOne works on a doc, not an array
    await job.deleteOne()                                   // ← stays correct

    res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}
