const User = require('../models/User')
const JobSeekerProfile = require('../models/JobSeekerProfile')
const HRProfile = require('../models/HRProfile')
const ResearcherProfile = require('../models/ResearcherProfile')
const { sendMail } = require('../services/mailer')
const jwt = require('jsonwebtoken')

function detectSenderTypeFromString(s) {
  const t = (s || '').toString().toLowerCase()
  if (t === 'hr' || t === 'hrs' || t.includes('hr')) return 'hr'
  if (t.startsWith('research')) return 'researcher'
  if (t.startsWith('job') || t.includes('candidate') || t.includes('seeker')) return 'jobseeker'
  return 'unknown'
}

async function fetchSenderProfilesByUserId(userId) {
  if (!userId) return { user: null, hr: null, jobseeker: null, researcher: null }
  const [user, hr, js, rs] = await Promise.all([
    User.findById(userId),
    HRProfile.findOne({ userId }),
    JobSeekerProfile.findOne({ userId }),
    ResearcherProfile.findOne({ userId }),
  ])
  return { user, hr, jobseeker: js, researcher: rs }
}

function tryGetUserIdFromAuthHeader(req) {
  try {
    const auth = req.headers?.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
    const cookieToken = req.cookies?.token || null
    const tok = token || cookieToken
    if (!tok) return null
    const extractId = (decoded) => (
      decoded?._id || decoded?.id || decoded?.userId || decoded?.user?._id || decoded?.user?.id || decoded?.user?.userId || null
    )
    try {
      const decoded = jwt.verify(tok, process.env.JWT_SECRET)
      return extractId(decoded)
    } catch (e) {
      const decoded = jwt.decode(tok)
      return extractId(decoded)
    }
  } catch {
    return null
  }
}

async function fetchRecipientBy(type, id) {
  if (type === 'hrs') {
    const p = await HRProfile.findById(id).populate('userId', 'email name')
    return { type: 'hr', profile: p, email: p?.userId?.email }
  } else if (type === 'seekers') {
    const p = await JobSeekerProfile.findById(id).populate('userId', 'email name')
    return { type: 'jobseeker', profile: p, email: p?.userId?.email }
  } else if (type === 'researchers') {
    const p = await ResearcherProfile.findById(id).populate('userId', 'email name')
    return { type: 'researcher', profile: p, email: p?.userId?.email }
  }
  return { type: 'unknown', profile: null, email: null }
}

function buildEmailSubject(senderType, recipientType) {
  if (senderType === 'hr' && recipientType === 'jobseeker') return 'Interest in your profile'
  if (senderType === 'jobseeker' && recipientType === 'hr') return 'Candidate contacting about your opening'
  if (recipientType === 'researcher' || senderType === 'researcher') return 'Collaboration / contact request'
  return 'New contact request on MatchMind'
}

function esc(s) {
  return (s || '').toString()
}

function buildEmailHTML({ senderType, recipientType, senderName, recipientProfile, customMessage, resumeLink, senderHRProfile, senderUser, senderJSProfile }) {
  const sender = esc(senderName) || esc(senderUser?.name) || 'A MatchMind user'

  const lines = []
  lines.push(`<p>Hello,</p>`)
  lines.push(`<p><strong>${sender}</strong> sent you a contact request via MatchMind.</p>`) 
  if (customMessage) lines.push(`<p><em>Message:</em> ${esc(customMessage)}</p>`)

  if (senderType === 'jobseeker') {
    lines.push(`<p><strong>Candidate summary</strong></p>`)
    lines.push(`<ul>`)
    const js = senderJSProfile || {}
    if (js.role) lines.push(`<li>Role: ${esc(js.role)}</li>`)
    if (Array.isArray(js.top_skills) && js.top_skills.length) lines.push(`<li>Top skills: ${js.top_skills.slice(0,8).map(esc).join(', ')}</li>`)
    if (js.location) lines.push(`<li>Location: ${esc(js.location)}</li>`)
    // Client may pass resumeLink; other details may be in message text
    if (resumeLink) lines.push(`<li>Resume: <a href="${esc(resumeLink)}">${esc(resumeLink)}</a></li>`)
    lines.push(`</ul>`)
  } else if (senderType === 'hr') {
    const hr = senderHRProfile || {}
    const roles = Array.isArray(hr.roles_hiring_for) ? hr.roles_hiring_for : []
    const r0 = roles.length ? roles[0] : null
    lines.push(`<p><strong>About our opportunity</strong></p>`)
    lines.push(`<ul>`)
    if (hr.name) lines.push(`<li>Contact: ${esc(hr.name)}</li>`)
    if (hr.company_name) lines.push(`<li>Company: ${esc(hr.company_name)}</li>`)
    if (hr.company_industry) lines.push(`<li>Industry: ${esc(hr.company_industry)}</li>`)
    if (hr.location) lines.push(`<li>Location: ${esc(hr.location)}</li>`)
    if (hr.contact_email) lines.push(`<li>Email: ${esc(hr.contact_email)}</li>`)
    if (r0?.title) lines.push(`<li>Role: ${esc(r0.title)}</li>`)
    if (r0?.job_summary) lines.push(`<li>Summary: ${esc(r0.job_summary)}</li>`)
    if (Array.isArray(r0?.skills_required) && r0.skills_required.length) {
      lines.push(`<li>Key skills: ${r0.skills_required.slice(0,8).map(esc).join(', ')}</li>`)
    }
    if (roles.length > 1) {
      const r1 = roles[1]
      if (r1?.title) lines.push(`<li>Also hiring: ${esc(r1.title)}</li>`)
    }
    lines.push(`</ul>`)
    lines.push(`<p>If you are interested, please reply to this email. We would love to speak with you.</p>`)
  } else if (senderType === 'researcher') {
    lines.push(`<p><strong>Research overview</strong></p>`)
    lines.push(`<ul>`)
    lines.push(`<li>Details provided in message.</li>`)
    lines.push(`</ul>`)
  }

  lines.push(`<p>Best regards,<br/>MatchMind</p>`)
  return lines.join('\n')
}

exports.sendContactEmail = async (req, res) => {
  try {
    const { recipientType, recipientProfileId, message, resumeLink, senderName, senderEmail, senderType, senderHR } = req.body || {}
    if (!recipientType || !recipientProfileId) {
      return res.status(400).json({ success: false, message: 'recipientType and recipientProfileId are required' })
    }

    const recipient = await fetchRecipientBy(recipientType, recipientProfileId)

    if (!recipient?.email || !recipient?.profile) {
      return res.status(404).json({ success: false, message: 'Recipient not found or has no email' })
    }

    // Try to derive sender from session user or JWT if present (without enforcing auth)
    const sessionUserId = req.user?._id || req.user?.id || null
    const authUserId = sessionUserId || tryGetUserIdFromAuthHeader(req)
    const senderProfiles = await fetchSenderProfilesByUserId(authUserId)
    console.log('contact: authUserId=', authUserId, 'hasHR=', !!senderProfiles.hr, 'hasJS=', !!senderProfiles.jobseeker, 'hasRS=', !!senderProfiles.researcher)
    const derivedType = senderProfiles.hr ? 'hr' : senderProfiles.jobseeker ? 'jobseeker' : senderProfiles.researcher ? 'researcher' : 'unknown'
    let finalSenderType = derivedType !== 'unknown' ? derivedType : detectSenderTypeFromString(senderType)
    if (finalSenderType === 'unknown') {
      // Infer based on recipient: contacting a jobseeker => probably HR; contacting HR => probably jobseeker; contacting researcher => probably HR
      finalSenderType = recipient.type === 'jobseeker' ? 'hr' : recipient.type === 'hr' ? 'jobseeker' : 'hr'
    }
    const finalSenderName = senderName
      || (senderProfiles.hr?.name ? `${senderProfiles.hr.name} from ${senderProfiles.hr.company_name || ''}`.trim() : '')
      || senderProfiles.user?.name
      || (senderProfiles.hr?.company_name ? `${senderProfiles.hr.company_name} HR` : '')
      || 'A MatchMind user'
    const finalReplyTo = senderEmail || senderProfiles.user?.email || senderProfiles.hr?.contact_email

    // Resolve HR profile if needed to enrich content
    let effectiveHRProfile = senderProfiles.hr
    if (finalSenderType === 'hr' && !effectiveHRProfile) {
      console.log('contact: missing HR profile; attempting fallback resolution...')
      // If client sent senderProfileId, prefer that
      if (req.body?.senderProfileId) {
        try {
          const maybeHr = await HRProfile.findById(req.body.senderProfileId)
          if (maybeHr) effectiveHRProfile = maybeHr
        } catch {}
      }
      // Else try by reply-to email
      if (!effectiveHRProfile && finalReplyTo) {
        const maybeHr = await HRProfile.findOne({ contact_email: finalReplyTo })
        if (maybeHr) effectiveHRProfile = maybeHr
      }
      // Else use client-provided senderHR object
      if (!effectiveHRProfile && senderHR && typeof senderHR === 'object') {
        effectiveHRProfile = senderHR
      }
    }
    console.log('contact: finalSenderType=', finalSenderType, 'hrProfileFound=', !!effectiveHRProfile)

    const subject = buildEmailSubject(finalSenderType, recipient.type)
    const html = buildEmailHTML({
      senderType: finalSenderType,
      recipientType: recipient.type,
      senderName: finalSenderName,
      recipientProfile: recipient.profile,
      customMessage: message,
      resumeLink,
      senderHRProfile: effectiveHRProfile,
      senderUser: senderProfiles.user,
      senderJSProfile: senderProfiles.jobseeker,
    })

    const info = await sendMail({ to: recipient.email, subject, html, text: '', replyTo: finalReplyTo })
    console.log('contact: email sent to', recipient.email, 'messageId=', info?.messageId)

    res.status(200).json({ success: true, message: 'Contact email sent', id: info.messageId })
  } catch (err) {
    console.error('sendContactEmail error:', err)
    res.status(500).json({ success: false, message: 'Failed to send email', error: err.message })
  }
}
