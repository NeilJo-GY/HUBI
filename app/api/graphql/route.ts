/**
 * This api route exposes a graphql api that routes requests to the Graph Network Arbitrum Subgraph on The Graph Network.
 * With this as an API route, the client never sees or exposes your API Key, securing it to help prevent leaks.
 *
 * This is exposed at `/graphql` route.
 */
import { GraphQLClient } from 'graphql-request';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/env/server';

// replace this with your Subgrah URL
const subgraphQueryUrl = 'https://api.studio.thegraph.com/query/92345/hubi/version/latest';

const client = new GraphQLClient(subgraphQueryUrl, {
  headers: {
    Authorization: `Bearer ${env.API_KEY}`,
  },
});

const GraphqlReqSchema = z.object({
  query: z.string().min(1),
  operationName: z.string().optional().nullable(),
  variables: z.record(z.unknown()).optional().nullable(),
});

async function process(request: Request) {
  const body = await request.json();
  const parsedGqlRequest = GraphqlReqSchema.safeParse(body);
  if (!parsedGqlRequest.success) {
    return NextResponse.json({ error: parsedGqlRequest.error }, { status: 400 });
  }
  const gqlRequest = parsedGqlRequest.data;

  try {
    const gqlResponse = await client.request(gqlRequest.query, gqlRequest.variables ?? undefined);
    return NextResponse.json({ data: gqlResponse }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return process(request);
}

export async function POST(request: Request) {
  return process(request);
}