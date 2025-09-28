# RSVP System Deployment Guide

## Overview
This Cloudflare Worker system handles RSVP submissions for your wedding website using Cloudflare KV for storage.

## Setup Instructions

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Create KV Namespace
```bash
# Create KV namespace for production
wrangler kv namespace create "RSVP_KV"

# Create KV namespace for preview (development)
wrangler kv namespace create "RSVP_KV" --preview
```

This will give you namespace IDs. Update the `wrangler.toml` file with these IDs:
```toml
[[kv_namespaces]]
binding = "RSVP_KV"
preview_id = "your-preview-id-here"
id = "your-production-id-here"
```

### 4. Update Configuration
1. Update `wrangler.toml` with your domain name
2. Update the route pattern to match your domain
3. Set your KV namespace IDs from step 3

### 5. Deploy the Workers
```bash
# Deploy RSVP handler
wrangler deploy

# Deploy admin interface (optional)
wrangler deploy --config wrangler-admin.toml
```

### 6. Routes Setup
The routes are automatically configured in the wrangler.toml files:
- `tulsiwedssmarika.com/api/rsvp` → RSVP submission handler
- `tulsiwedssmarika.com/admin/*` → Admin interface for viewing RSVPs

**Note**: Make sure `tulsiwedssmarika.com` is added to your Cloudflare account and properly configured.

## API Endpoints

### RSVP Submission
**POST** `/api/rsvp`

Request body:
```json
{
  "name": "John & Jane Doe",
  "email": "john@example.com",
  "attending": true,
  "guests": 2,
  "mealPreference": "vegetarian",
  "dietaryRequirements": "Nut allergy",
  "message": "Can't wait to celebrate with you!"
}
```

Response:
```json
{
  "success": true,
  "message": "RSVP submitted successfully!"
}
```

### Admin Interface
**GET** `/admin/rsvps` - View all RSVPs (HTML interface)
**GET** `/admin/rsvp?email=guest@example.com` - View specific RSVP
**GET** `/admin/export` - Download CSV export

## Security Notes

1. **Origin Restriction**: RSVP API only accepts requests from `https://tulsiwedssmarika.com`
2. **Admin Authentication**: Update the `Bearer your-secret-token-here` in `admin-worker.js` with a strong secret
3. **CORS**: Properly configured to only allow requests from your wedding website
4. **Rate Limiting**: Consider adding rate limiting for production use if needed

## KV Storage Structure

### Keys
- `rsvp:{email}` - Individual RSVP data
- `rsvp-list:{date}` - Daily submission lists (for admin queries)

### Data Format
```json
{
  "name": "Guest Name",
  "email": "guest@example.com",
  "attending": true,
  "guests": 2,
  "mealPreference": "vegetarian",
  "dietaryRequirements": "None",
  "message": "Looking forward to it!",
  "submittedAt": "2025-01-15T10:30:00Z",
  "ipAddress": "1.2.3.4"
}
```

## Testing

Test the worker locally:
```bash
wrangler dev rsvp-worker.js
```

Test with curl:
```bash
curl -X POST http://localhost:8787/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Guest",
    "email": "test@example.com",
    "attending": true,
    "guests": 1,
    "mealPreference": "vegetarian"
  }'
```

## Troubleshooting

1. **KV Namespace Issues**: Ensure KV namespace IDs are correct in wrangler.toml
2. **CORS Errors**: Check that CORS headers are properly set
3. **Route Issues**: Verify routes are configured correctly in Cloudflare dashboard
4. **Authentication**: Update admin worker with proper authentication token

## Cost Estimation

Cloudflare Workers and KV are very cost-effective for wedding-sized data:
- Workers: 100,000 requests/day free
- KV: 100,000 read/write operations per day free
- For a typical wedding (100-200 guests), costs will be minimal or free