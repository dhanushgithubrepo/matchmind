# Profile API Endpoints

## Job Seeker
- POST `/api/profiles/jobseeker` - Create/Update profile
- GET `/api/profiles/jobseeker` - Get your profile
- GET `/api/profiles/jobseekers/all` - Get all job seekers

## Researcher
- POST `/api/profiles/researcher` - Create/Update profile
- GET `/api/profiles/researcher` - Get your profile
- GET `/api/profiles/researchers/all` - Get all researchers

## HR
- POST `/api/profiles/hr` - Create/Update profile
- GET `/api/profiles/hr` - Get your profile
- GET `/api/profiles/hrs/all` - Get all HR profiles

## General
- DELETE `/api/profiles/:profileType` - Delete profile (jobseeker/researcher/hr)

All endpoints require JWT token in Authorization header:
`Authorization: Bearer <token>`
