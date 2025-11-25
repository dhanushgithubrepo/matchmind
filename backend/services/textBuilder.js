function buildJobSeekerText(profile) {
  const parts = [];
  parts.push(`name: ${profile.name || ''}`);
  parts.push(`role: ${profile.role || ''}`);
  parts.push(`location: ${profile.location || ''}`);
  if (Array.isArray(profile.top_skills)) parts.push(`skills: ${profile.top_skills.join(', ')}`);
  if (profile.career_objective) parts.push(`objective: ${profile.career_objective}`);
  parts.push(`experience_years: ${profile.years_of_experience || ''}`);
  if (profile.expected_salary) parts.push(`expected_salary: ${profile.expected_salary}`);
  if (Array.isArray(profile.projects)) {
    for (const p of profile.projects) {
      const tech = Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : '';
      parts.push(`project: ${p.title || ''} ${p.description || ''} tech: ${tech}`);
    }
  }
  if (Array.isArray(profile.education)) {
    for (const e of profile.education) {
      parts.push(`edu: ${e.degree || ''} ${e.institution || ''} ${e.year || ''}`);
    }
  }
  return parts.filter(Boolean).join('\n');
}

function buildResearcherText(profile) {
  const parts = [];
  parts.push(`name: ${profile.name || ''}`);
  parts.push(`affiliation: ${profile.affiliation || ''}`);
  parts.push(`field: ${profile.field_of_research || ''}`);
  if (Array.isArray(profile.research_keywords)) parts.push(`keywords: ${profile.research_keywords.join(', ')}`);
  if (profile.career_objective) parts.push(`objective: ${profile.career_objective}`);
  if (Array.isArray(profile.skills_needed)) parts.push(`skills_needed: ${profile.skills_needed.join(', ')}`);
  if (Array.isArray(profile.projects)) {
    for (const p of profile.projects) {
      const tech = Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : '';
      const methods = Array.isArray(p.methods_used) ? p.methods_used.join(', ') : '';
      parts.push(`project: ${p.title || ''} ${p.description || ''} tech: ${tech} methods: ${methods}`);
    }
  }
  if (Array.isArray(profile.education)) {
    for (const e of profile.education) parts.push(`edu: ${e.degree || ''} ${e.institution || ''} ${e.year || ''}`);
  }
  if (Array.isArray(profile.publications)) {
    for (const pub of profile.publications) parts.push(`pub: ${pub.title || ''} ${pub.journal_or_conference || ''} ${pub.year || ''}`);
  }
  return parts.filter(Boolean).join('\n');
}

function buildHRText(profile) {
  const parts = [];
  parts.push(`name: ${profile.name || ''}`);
  parts.push(`company: ${profile.company_name || ''}`);
  parts.push(`industry: ${profile.company_industry || ''}`);
  parts.push(`location: ${profile.location || ''}`);
  if (Array.isArray(profile.roles_hiring_for)) {
    for (const r of profile.roles_hiring_for) {
      const skills = Array.isArray(r.skills_required) ? r.skills_required.join(', ') : '';
      parts.push(`role: ${r.title || ''} summary: ${r.job_summary || ''} exp: ${r.experience_level || ''} type: ${r.job_type || ''} salary: ${r.salary_range || ''} skills: ${skills} desc: ${r.description || ''}`);
    }
  }
  return parts.filter(Boolean).join('\n');
}

module.exports = { buildJobSeekerText, buildResearcherText, buildHRText };
