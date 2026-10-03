// Cloudflare Pages Function: /api/team/workspace
// Manages Team Project Spaces, Enterprise Report Branding, and RBAC Member lists

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
    },
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const teamId = url.searchParams.get('teamId') || url.searchParams.get('email');

  if (!teamId) {
    return json({ ok: false, error: 'missing_team_id' }, 400);
  }

  try {
    if (env.ab_test) {
      const raw = await env.ab_test.get(`team:${teamId.toLowerCase()}`);
      if (raw) {
        return json({ ok: true, workspace: JSON.parse(raw) });
      }
    }

    // Default template structure if not yet saved
    return json({
      ok: true,
      workspace: {
        teamId,
        enterpriseName: '',
        projectCodePrefix: 'PRJ-',
        defaultInspector: '',
        disclaimerStamp: 'Official Sound Documentation · SOUNDTEST.PRO Team Space',
        logoUrl: '',
        members: [
          { email: teamId, role: 'admin', name: 'Team Owner', addedAt: new Date().toISOString() }
        ],
        projectSpaces: [
          { id: 'proj-1', name: 'Community Noise Coordination', code: 'PRJ-001', recordCount: 0 }
        ],
        retentionDays: 365,
      },
    });
  } catch (err) {
    return json({ ok: false, error: 'server_error', message: err.message }, 500);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json().catch(() => ({}));
    const teamId = String(body.teamId || body.email || '').trim().toLowerCase();

    if (!teamId) {
      return json({ ok: false, error: 'missing_team_id' }, 400);
    }

    const workspaceData = {
      teamId,
      enterpriseName: String(body.enterpriseName || '').trim(),
      projectCodePrefix: String(body.projectCodePrefix || 'PRJ-').trim(),
      defaultInspector: String(body.defaultInspector || '').trim(),
      disclaimerStamp: String(body.disclaimerStamp || '').trim(),
      logoUrl: String(body.logoUrl || '').trim(),
      members: Array.isArray(body.members) ? body.members : [],
      projectSpaces: Array.isArray(body.projectSpaces) ? body.projectSpaces : [],
      retentionDays: Number(body.retentionDays) || 365,
      updatedAt: new Date().toISOString(),
    };

    if (env.ab_test) {
      await env.ab_test.put(`team:${teamId}`, JSON.stringify(workspaceData));
    }

    return json({ ok: true, workspace: workspaceData });
  } catch (err) {
    return json({ ok: false, error: 'server_error', message: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}
