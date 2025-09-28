/**
 * RSVP Cloudflare Worker for Tulsi & Smarika Wedding Website
 * Handles RSVP form submissions and stores data in Cloudflare KV
 */

export default {
  async fetch(request, env, ctx) {
    // Check origin for security - only allow requests from the wedding website
    const origin = request.headers.get('Origin');
    const allowedOrigin = 'https://tulsiwedssmarika.com';

    if (origin !== allowedOrigin) {
      return new Response('Forbidden - Invalid origin', {
        status: 403,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
        },
      });
    }

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests for RSVP submissions
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
        },
      });
    }

    try {
      // Parse the request body
      const formData = await request.json();

      // Validate required fields
      const validation = validateRSVPData(formData);
      if (!validation.isValid) {
        return new Response(JSON.stringify({
          success: false,
          error: validation.error
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          },
        });
      }

      // Generate unique key for this RSVP
      const rsvpKey = `rsvp:${formData.email.toLowerCase()}`;

      // Prepare RSVP data for storage
      const rsvpData = {
        name: formData.name,
        email: formData.email.toLowerCase(),
        attending: formData.attending,
        guests: parseInt(formData.guests) || 1,
        mealPreference: formData.mealPreference || '',
        dietaryRequirements: formData.dietaryRequirements || '',
        message: formData.message || '',
        submittedAt: new Date().toISOString(),
        ipAddress: request.headers.get('CF-Connecting-IP'),
      };

      // Store in KV
      await env.RSVP_KV.put(rsvpKey, JSON.stringify(rsvpData));

      // Also store in a list for admin access (optional)
      const listKey = `rsvp-list:${new Date().toISOString().split('T')[0]}`;
      let dailyList = [];
      try {
        const existingList = await env.RSVP_KV.get(listKey);
        if (existingList) {
          dailyList = JSON.parse(existingList);
        }
      } catch (e) {
        // If list doesn't exist, start fresh
      }

      dailyList.push(rsvpKey);
      await env.RSVP_KV.put(listKey, JSON.stringify(dailyList));

      return new Response(JSON.stringify({
        success: true,
        message: 'RSVP submitted successfully!'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
        },
      });

    } catch (error) {
      console.error('Error processing RSVP:', error);

      return new Response(JSON.stringify({
        success: false,
        error: 'Server error. Please try again later.'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
        },
      });
    }
  },
};

/**
 * Validate RSVP form data
 */
function validateRSVPData(data) {
  // Check required fields
  if (!data.name || data.name.trim().length < 2) {
    return { isValid: false, error: 'Name is required (minimum 2 characters)' };
  }

  if (!data.email || !isValidEmail(data.email)) {
    return { isValid: false, error: 'Valid email address is required' };
  }

  if (data.attending === undefined || data.attending === null) {
    return { isValid: false, error: 'Please indicate if you will be attending' };
  }

  if (data.attending && (!data.guests || data.guests < 1 || data.guests > 10)) {
    return { isValid: false, error: 'Number of guests must be between 1 and 10' };
  }

  // Validate meal preference if attending
  if (data.attending && data.mealPreference &&
      !['vegetarian', 'non-vegetarian', 'vegan'].includes(data.mealPreference)) {
    return { isValid: false, error: 'Invalid meal preference' };
  }

  // Check for reasonable message length
  if (data.message && data.message.length > 500) {
    return { isValid: false, error: 'Message must be less than 500 characters' };
  }

  return { isValid: true };
}

/**
 * Simple email validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}