const { NotFoundError, BadRequestError } = require('../errors')
const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req
    const job = await Job.findOne({ _id: jobId, createdBy: userId })   // ← updated
    if (!job) throw new NotFoundError(`job with id: ${jobId} not found`)
    res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
    const {
        user: { userId },
        body: { company, position },
        params: { id: jobId }
    } = req
    if (company === '' || position === '') {
        throw new BadRequestError('Company or Postion must not be empty')
    }
    const job = await Job.findOneAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true },
    )
    if (!job) throw new NotFoundError(`job with id: ${jobId} not found`)
    res.status(StatusCodes.OK).json({ job })

}

const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req
    const job = await Job.findOneAndDelete({
        _id: jobId,
        createdBy: userId,
    })
    if (!job) throw new NotFoundError(`job with id: ${jobId} not found`)
    res.status(StatusCodes.NO_CONTENT).send()
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}
