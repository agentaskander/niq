import { handleLeadRequest, type LeadEndpointEnv } from "../../packages/shared-leads/src/server/leadEndpoint";

type PagesContext = {
  request: Request;
  env: LeadEndpointEnv;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export async function onRequest(context: PagesContext) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, Allow: "POST", "Content-Type": "application/json" }
    });
  }

  const response = await handleLeadRequest(context.request, context.env);
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
