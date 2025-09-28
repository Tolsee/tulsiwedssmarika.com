/**
 * Admin Worker for Viewing RSVPs
 * Simple interface to view all RSVP submissions
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Simple authentication (replace with your preferred method)
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== 'Bearer your-secret-token-here') {
      return new Response('Unauthorized', { status: 401 });
    }

    if (url.pathname === '/admin/rsvps') {
      return await handleRSVPList(env);
    }

    if (url.pathname === '/admin/rsvp' && url.searchParams.get('email')) {
      return await handleSingleRSVP(env, url.searchParams.get('email'));
    }

    if (url.pathname === '/admin/export') {
      return await handleExport(env);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleRSVPList(env) {
  try {
    // Get all RSVP keys
    const rsvpKeys = [];
    let cursor = undefined;

    do {
      const result = await env.RSVP_KV.list({ prefix: 'rsvp:', cursor });
      rsvpKeys.push(...result.keys.map(k => k.name));
      cursor = result.cursor;
    } while (cursor);

    // Get all RSVP data
    const rsvps = [];
    for (const key of rsvpKeys) {
      if (key.startsWith('rsvp:') && !key.startsWith('rsvp-list:')) {
        const data = await env.RSVP_KV.get(key);
        if (data) {
          rsvps.push(JSON.parse(data));
        }
      }
    }

    // Generate HTML response
    const html = generateRSVPListHTML(rsvps);
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

async function handleSingleRSVP(env, email) {
  try {
    const rsvpKey = `rsvp:${email.toLowerCase()}`;
    const data = await env.RSVP_KV.get(rsvpKey);

    if (!data) {
      return new Response('RSVP not found', { status: 404 });
    }

    return new Response(JSON.stringify(JSON.parse(data), null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

async function handleExport(env) {
  try {
    // Get all RSVPs
    const rsvpKeys = [];
    let cursor = undefined;

    do {
      const result = await env.RSVP_KV.list({ prefix: 'rsvp:', cursor });
      rsvpKeys.push(...result.keys.map(k => k.name));
      cursor = result.cursor;
    } while (cursor);

    const rsvps = [];
    for (const key of rsvpKeys) {
      if (key.startsWith('rsvp:') && !key.startsWith('rsvp-list:')) {
        const data = await env.RSVP_KV.get(key);
        if (data) {
          rsvps.push(JSON.parse(data));
        }
      }
    }

    // Generate CSV
    const csv = generateCSV(rsvps);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="wedding-rsvps.csv"',
      },
    });

  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

function generateRSVPListHTML(rsvps) {
  const attending = rsvps.filter(r => r.attending);
  const notAttending = rsvps.filter(r => !r.attending);
  const totalGuests = attending.reduce((sum, r) => sum + r.guests, 0);

  return `
<!DOCTYPE html>
<html>
<head>
    <title>Wedding RSVPs - Tulsi & Smarika</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .stats { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .rsvp-item { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .attending { border-left: 4px solid #10b981; }
        .not-attending { border-left: 4px solid #ef4444; }
        .meal-pref { color: #6b7280; font-size: 0.9em; }
    </style>
</head>
<body>
    <h1>Wedding RSVPs - Tulsi & Smarika</h1>

    <div class="stats">
        <h3>Statistics</h3>
        <p><strong>Total Responses:</strong> ${rsvps.length}</p>
        <p><strong>Attending:</strong> ${attending.length} (${totalGuests} guests total)</p>
        <p><strong>Not Attending:</strong> ${notAttending.length}</p>
    </div>

    <h3>Attending Guests</h3>
    ${attending.map(rsvp => `
        <div class="rsvp-item attending">
            <strong>${rsvp.name}</strong> - ${rsvp.email}<br>
            <span class="meal-pref">Guests: ${rsvp.guests} | Meal: ${rsvp.mealPreference || 'Not specified'}</span><br>
            ${rsvp.dietaryRequirements ? `<span class="meal-pref">Dietary: ${rsvp.dietaryRequirements}</span><br>` : ''}
            ${rsvp.message ? `<em>"${rsvp.message}"</em><br>` : ''}
            <small>Submitted: ${new Date(rsvp.submittedAt).toLocaleString()}</small>
        </div>
    `).join('')}

    <h3>Not Attending</h3>
    ${notAttending.map(rsvp => `
        <div class="rsvp-item not-attending">
            <strong>${rsvp.name}</strong> - ${rsvp.email}<br>
            ${rsvp.message ? `<em>"${rsvp.message}"</em><br>` : ''}
            <small>Submitted: ${new Date(rsvp.submittedAt).toLocaleString()}</small>
        </div>
    `).join('')}

    <p><a href="/admin/export" style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Export CSV</a></p>
</body>
</html>`;
}

function generateCSV(rsvps) {
  const headers = ['Name', 'Email', 'Attending', 'Guests', 'Meal Preference', 'Dietary Requirements', 'Message', 'Submitted At'];
  const rows = rsvps.map(rsvp => [
    rsvp.name,
    rsvp.email,
    rsvp.attending ? 'Yes' : 'No',
    rsvp.guests || '',
    rsvp.mealPreference || '',
    rsvp.dietaryRequirements || '',
    rsvp.message || '',
    rsvp.submittedAt
  ]);

  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
}