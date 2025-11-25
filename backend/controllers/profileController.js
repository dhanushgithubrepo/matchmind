const User = require('../models/User');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const ResearcherProfile = require('../models/ResearcherProfile');
const HRProfile = require('../models/HRProfile');
const { getEmbedding } = require('../services/embeddingService');
const { buildJobSeekerText, buildResearcherText, buildHRText } = require('../services/textBuilder');

// ==================== JOB SEEKER PROFILE ====================

// Create or Update Job Seeker Profile
exports.createOrUpdateJobSeekerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileData = { ...req.body };
    delete profileData.profile_embedding;

    // Normalize top_skills to an array of strings
    if (typeof profileData.top_skills === 'string') {
      profileData.top_skills = profileData.top_skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    // Normalize projects tech_stack to arrays
    if (Array.isArray(profileData.projects)) {
      profileData.projects = profileData.projects.map((project) => {
        const normalized = { ...project };
        if (typeof normalized.tech_stack === 'string') {
          normalized.tech_stack = normalized.tech_stack
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        }
        return normalized;
      });
    }

    // Build embedding from incoming data to avoid stale doc reads
    let embedding = [];
    try {
      const text = buildJobSeekerText({ ...profileData });
      const raw = await getEmbedding(text);
      if (Array.isArray(raw)) {
        const clean = raw.map((v) => Number(v)).filter((v) => Number.isFinite(v));
        if (clean.length > 0) embedding = clean;
      }
    } catch (e) {
      console.error('Embedding generation failed (jobseeker upsert):', e.message);
    }

    const update = { ...profileData, updatedAt: Date.now() };
    console.log('JobSeeker embedding len:', Array.isArray(embedding) ? embedding.length : 'n/a');
    if (Array.isArray(embedding) && embedding.length > 0) {
      update.profile_embedding = embedding;
    }
    const profile = await JobSeekerProfile.findOneAndUpdate(
      { userId },
      { $set: update, $setOnInsert: { userId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (Array.isArray(embedding) && embedding.length > 0 && profile?._id) {
      const resU = await JobSeekerProfile.updateOne({ _id: profile._id }, { $set: { profile_embedding: embedding } });
      console.log('JobSeeker embedding write:', resU?.acknowledged, 'matched', resU?.matchedCount, 'modified', resU?.modifiedCount);
    }

    res.status(200).json({
      success: true,
      message: 'Job seeker profile saved successfully',
      profile
    });
  } catch (error) {
    console.error('Error saving job seeker profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving job seeker profile',
      error: error.message
    });
  }
};

// Get Job Seeker Profile
exports.getJobSeekerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await JobSeekerProfile.findOne({ userId }).populate('userId', 'name email picture');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Job seeker profile not found'
      });
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error fetching job seeker profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job seeker profile',
      error: error.message
    });
  }
};

// ==================== RESEARCHER PROFILE ====================

// Create or Update Researcher Profile
exports.createOrUpdateResearcherProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileData = { ...req.body };
    delete profileData.profile_embedding;

    // Normalize research_keywords and skills_needed to arrays of strings
    if (typeof profileData.research_keywords === 'string') {
      profileData.research_keywords = profileData.research_keywords
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    if (typeof profileData.skills_needed === 'string') {
      profileData.skills_needed = profileData.skills_needed
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    // Normalize projects arrays
    if (Array.isArray(profileData.projects)) {
      profileData.projects = profileData.projects.map((proj) => {
        const p = { ...proj };
        if (typeof p.tech_stack === 'string') {
          p.tech_stack = p.tech_stack
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        }
        if (typeof p.methods_used === 'string') {
          p.methods_used = p.methods_used
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        }
        return p;
      });
    }

    // Normalize publications: if provided as a single string, wrap as one publication title
    if (profileData.publications && !Array.isArray(profileData.publications)) {
      if (typeof profileData.publications === 'string' && profileData.publications.trim().length > 0) {
        profileData.publications = [ { title: profileData.publications.trim() } ];
      }
    }

    let rEmbedding = [];
    try {
      const text = buildResearcherText({ ...profileData });
      const raw = await getEmbedding(text);
      if (Array.isArray(raw)) {
        const clean = raw.map((v) => Number(v)).filter((v) => Number.isFinite(v));
        if (clean.length > 0) rEmbedding = clean;
      }
    } catch (e) {
      console.error('Embedding generation failed (researcher upsert):', e.message);
    }

    const rUpdate = { ...profileData, updatedAt: Date.now() };
    console.log('Researcher embedding len:', Array.isArray(rEmbedding) ? rEmbedding.length : 'n/a');
    if (Array.isArray(rEmbedding) && rEmbedding.length > 0) {
      rUpdate.profile_embedding = rEmbedding;
    }
    const profile = await ResearcherProfile.findOneAndUpdate(
      { userId },
      { $set: rUpdate, $setOnInsert: { userId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (Array.isArray(rEmbedding) && rEmbedding.length > 0 && profile?._id) {
      const resU = await ResearcherProfile.updateOne({ _id: profile._id }, { $set: { profile_embedding: rEmbedding } });
      console.log('Researcher embedding write:', resU?.acknowledged, 'matched', resU?.matchedCount, 'modified', resU?.modifiedCount);
    }

    res.status(200).json({
      success: true,
      message: 'Researcher profile saved successfully',
      profile
    });
  } catch (error) {
    console.error('Error saving researcher profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving researcher profile',
      error: error.message
    });
  }
};

// Get Researcher Profile
exports.getResearcherProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await ResearcherProfile.findOne({ userId }).populate('userId', 'name email picture');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Researcher profile not found'
      });
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error fetching researcher profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching researcher profile',
      error: error.message
    });
  }
};

// ==================== HR PROFILE ====================

// Create or Update HR Profile
exports.createOrUpdateHRProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileData = { ...req.body };
    delete profileData.profile_embedding;

    // Normalize roles_hiring_for.skills_required to an array of strings
    if (Array.isArray(profileData.roles_hiring_for)) {
      profileData.roles_hiring_for = profileData.roles_hiring_for.map((role) => {
        const normalized = { ...role };
        if (typeof normalized.skills_required === 'string') {
          normalized.skills_required = normalized.skills_required
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        }
        return normalized;
      });
    }

    let hEmbedding = [];
    try {
      const text = buildHRText({ ...profileData });
      const raw = await getEmbedding(text);
      if (Array.isArray(raw)) {
        const clean = raw.map((v) => Number(v)).filter((v) => Number.isFinite(v));
        if (clean.length > 0) hEmbedding = clean;
      }
    } catch (e) {
      console.error('Embedding generation failed (hr upsert):', e.message);
    }

    const hUpdate = { ...profileData, updatedAt: Date.now() };
    console.log('HR embedding len:', Array.isArray(hEmbedding) ? hEmbedding.length : 'n/a');
    if (Array.isArray(hEmbedding) && hEmbedding.length > 0) {
      hUpdate.profile_embedding = hEmbedding;
    }
    const profile = await HRProfile.findOneAndUpdate(
      { userId },
      { $set: hUpdate, $setOnInsert: { userId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    if (Array.isArray(hEmbedding) && hEmbedding.length > 0 && profile?._id) {
      const resU = await HRProfile.updateOne({ _id: profile._id }, { $set: { profile_embedding: hEmbedding } });
      console.log('HR embedding write:', resU?.acknowledged, 'matched', resU?.matchedCount, 'modified', resU?.modifiedCount);
    }

    res.status(200).json({
      success: true,
      message: 'HR profile saved successfully',
      profile
    });
  } catch (error) {
    console.error('Error saving HR profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving HR profile',
      error: error.message
    });
  }
};

// Get HR Profile
exports.getHRProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await HRProfile.findOne({ userId }).populate('userId', 'name email picture');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'HR profile not found'
      });
    }

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error fetching HR profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching HR profile',
      error: error.message
    });
  }
};

// ==================== GENERAL PROFILE OPERATIONS ====================

// Get All Profiles (for matching/search)
exports.getAllJobSeekers = async (req, res) => {
  try {
    const profiles = await JobSeekerProfile.find().populate('userId', 'name email picture');
    
    res.status(200).json({
      success: true,
      count: profiles.length,
      profiles
    });
  } catch (error) {
    console.error('Error fetching job seekers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job seekers',
      error: error.message
    });
  }
};

exports.getAllResearchers = async (req, res) => {
  try {
    const profiles = await ResearcherProfile.find().populate('userId', 'name email picture');
    
    res.status(200).json({
      success: true,
      count: profiles.length,
      profiles
    });
  } catch (error) {
    console.error('Error fetching researchers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching researchers',
      error: error.message
    });
  }
};

exports.getAllHRProfiles = async (req, res) => {
  try {
    const profiles = await HRProfile.find().populate('userId', 'name email picture');
    
    res.status(200).json({
      success: true,
      count: profiles.length,
      profiles
    });
  } catch (error) {
    console.error('Error fetching HR profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching HR profiles',
      error: error.message
    });
  }
};

// Delete Profile
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profileType } = req.params;

    let deletedProfile;
    
    switch (profileType) {
      case 'jobseeker':
        deletedProfile = await JobSeekerProfile.findOneAndDelete({ userId });
        break;
      case 'researcher':
        deletedProfile = await ResearcherProfile.findOneAndDelete({ userId });
        break;
      case 'hr':
        deletedProfile = await HRProfile.findOneAndDelete({ userId });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid profile type'
        });
    }

    if (!deletedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting profile',
      error: error.message
    });
  }
};

// ==================== MATCHING ====================

exports.matchCandidates = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const { query, topK = 20, useHRProfileEmbedding = true, blendWeight = 0.7, target = 'seekers' } = req.body || {};
    const qLower = (query || '').toString().toLowerCase();
    const validTarget = (target === 'hrs' || target === 'seekers' || target === 'researchers') ? target : null;
    const mentionsHR = /\b(hr|hiring manager|recruiter|talent acquisition)\b/.test(qLower);
    const mentionsSeeker = /\b(developer|engineer|candidate|job seeker|software)\b/.test(qLower);
    const mentionsResearcher = /\b(researcher|research|scientist|professor|academia)\b/.test(qLower);
    // If explicit valid target is provided, use it. Otherwise, HR mention dominates, then researchers, else seekers.
    const computedTarget = validTarget || (mentionsHR ? 'hrs' : (mentionsResearcher ? 'researchers' : 'seekers'));

    let qVec = [];
    if (typeof query === 'string' && query.trim().length > 0) {
      const raw = await getEmbedding(query.trim());
      if (Array.isArray(raw)) {
        const clean = raw.map((v) => Number(v)).filter((v) => Number.isFinite(v));
        if (clean.length > 0) qVec = clean;
      }
    }

    // Back-compat note: useHRProfileEmbedding indicates we should use the signed-in user's stored embedding.
    // For target='seekers' (HR looking for candidates): use HRProfile embedding.
    // For target='hrs' (Job seeker looking for HRs): use JobSeekerProfile embedding.
    // For target='researchers' (looking for researchers): use ResearcherProfile embedding.
    let userVec = [];
    if (useHRProfileEmbedding && userId) {
      if (computedTarget === 'seekers') {
        const hr = await HRProfile.findOne({ userId }, { profile_embedding: 1 });
        if (hr && Array.isArray(hr.profile_embedding) && hr.profile_embedding.length > 0) {
          userVec = hr.profile_embedding.map((v) => Number(v)).filter((v) => Number.isFinite(v));
        }
      } else if (computedTarget === 'hrs') {
        const js = await JobSeekerProfile.findOne({ userId }, { profile_embedding: 1 });
        if (js && Array.isArray(js.profile_embedding) && js.profile_embedding.length > 0) {
          userVec = js.profile_embedding.map((v) => Number(v)).filter((v) => Number.isFinite(v));
        }
      } else if (computedTarget === 'researchers') {
        const rs = await ResearcherProfile.findOne({ userId }, { profile_embedding: 1 });
        if (rs && Array.isArray(rs.profile_embedding) && rs.profile_embedding.length > 0) {
          userVec = rs.profile_embedding.map((v) => Number(v)).filter((v) => Number.isFinite(v));
        }
      }
    }

    let refVec = [];
    if (qVec.length && userVec.length && qVec.length === userVec.length) {
      const w = Math.max(0, Math.min(1, Number(blendWeight)));
      refVec = qVec.map((v, i) => v * w + userVec[i] * (1 - w));
    } else if (qVec.length) {
      refVec = qVec;
    } else if (userVec.length) {
      refVec = userVec;
    } else {
      return res.status(400).json({ success: false, message: 'No valid query or HR embedding available' });
    }

    console.log('matchCandidates target:', computedTarget, 'qVecDim:', qVec.length, 'userVecDim:', userVec.length);
    const norm = Math.sqrt(refVec.reduce((s, v) => s + v * v, 0)) || 1;
    const vec = refVec.map((v) => v / norm);

    const scored = [];
    if (computedTarget === 'hrs') {
      const hrs = await HRProfile.find({ profile_embedding: { $exists: true, $ne: [] } }).populate('userId', 'email name');
      console.log('HR pool size:', hrs.length);
      for (const h of hrs) {
        if (!Array.isArray(h.profile_embedding) || h.profile_embedding.length !== vec.length) continue;
        const sv = h.profile_embedding;
        let dot = 0; let sn = 0;
        for (let i = 0; i < vec.length; i++) { const x = Number(sv[i]) || 0; dot += vec[i] * x; sn += x * x; }
        const sim = sn > 0 ? dot / Math.sqrt(sn) : 0;
        scored.push({ profile: h, score: sim });
      }
    } else if (computedTarget === 'seekers') {
      const seekers = await JobSeekerProfile.find({ profile_embedding: { $exists: true, $ne: [] } }).populate('userId', 'email name');
      console.log('Seeker pool size:', seekers.length);
      for (const s of seekers) {
        if (!Array.isArray(s.profile_embedding) || s.profile_embedding.length !== vec.length) continue;
        const sv = s.profile_embedding;
        let dot = 0; let sn = 0;
        for (let i = 0; i < vec.length; i++) { const x = Number(sv[i]) || 0; dot += vec[i] * x; sn += x * x; }
        const sim = sn > 0 ? dot / Math.sqrt(sn) : 0;
        scored.push({ profile: s, score: sim });
      }
    } else {
      const researchers = await ResearcherProfile.find({ profile_embedding: { $exists: true, $ne: [] } }).populate('userId', 'email name');
      console.log('Researcher pool size:', researchers.length);
      for (const r of researchers) {
        if (!Array.isArray(r.profile_embedding) || r.profile_embedding.length !== vec.length) continue;
        const sv = r.profile_embedding;
        let dot = 0; let sn = 0;
        for (let i = 0; i < vec.length; i++) { const x = Number(sv[i]) || 0; dot += vec[i] * x; sn += x * x; }
        const sim = sn > 0 ? dot / Math.sqrt(sn) : 0;
        scored.push({ profile: r, score: sim });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    const k = Math.max(1, Math.min(Number(topK) || 20, 100));
    const results = scored.slice(0, k);

    res.status(200).json({ success: true, count: results.length, results });
  } catch (error) {
    console.error('Error matching candidates:', error);
    res.status(500).json({ success: false, message: 'Error matching candidates', error: error.message });
  }
};
