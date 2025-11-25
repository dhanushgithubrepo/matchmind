const express = require('express');
const profileController = require('../controllers/profileController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ==================== JOB SEEKER ROUTES ====================

// @route   POST /api/profiles/jobseeker
// @desc    Create or update job seeker profile
// @access  Private
router.post('/jobseeker', verifyToken, profileController.createOrUpdateJobSeekerProfile);

// @route   GET /api/profiles/jobseeker
// @desc    Get current user's job seeker profile
// @access  Private
router.get('/jobseeker', verifyToken, profileController.getJobSeekerProfile);

// @route   GET /api/profiles/jobseekers/all
// @desc    Get all job seeker profiles (for HR/matching)
// @access  Private
router.get('/jobseekers/all', verifyToken, profileController.getAllJobSeekers);

// ==================== RESEARCHER ROUTES ====================

// @route   POST /api/profiles/researcher
// @desc    Create or update researcher profile
// @access  Private
router.post('/researcher', verifyToken, profileController.createOrUpdateResearcherProfile);

// @route   GET /api/profiles/researcher
// @desc    Get current user's researcher profile
// @access  Private
router.get('/researcher', verifyToken, profileController.getResearcherProfile);

// @route   GET /api/profiles/researchers/all
// @desc    Get all researcher profiles (for collaboration matching)
// @access  Private
router.get('/researchers/all', verifyToken, profileController.getAllResearchers);

// ==================== HR ROUTES ====================

// @route   POST /api/profiles/hr
// @desc    Create or update HR profile
// @access  Private
router.post('/hr', verifyToken, profileController.createOrUpdateHRProfile);

// @route   GET /api/profiles/hr
// @desc    Get current user's HR profile
// @access  Private
router.get('/hr', verifyToken, profileController.getHRProfile);

// @route   GET /api/profiles/hrs/all
// @desc    Get all HR profiles (for job listings)
// @access  Private
router.get('/hrs/all', verifyToken, profileController.getAllHRProfiles);

// ==================== GENERAL ROUTES ====================

// @route   POST /api/profiles/match
// @desc    Match job seekers by cosine similarity against HR query/profile embedding
// @access  Public
router.post('/match', profileController.matchCandidates);

// @route   DELETE /api/profiles/:profileType
// @desc    Delete user profile
// @access  Private
router.delete('/:profileType', verifyToken, profileController.deleteProfile);

module.exports = router;
