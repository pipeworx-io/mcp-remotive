interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Remotive MCP — curated remote-only job board
 *
 * Auth: none.
 * Docs: https://remotive.com/api-documentation
 */


const BASE = 'https://remotive.com/api';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'Search remote jobs by free-text + category + company.',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Free-text — title / description' },
        category: { type: 'string', description: 'Category slug (e.g. "software-dev", "design")' },
        company_name: { type: 'string', description: 'Filter to a specific company' },
        limit: { type: 'number', description: 'Max jobs returned (default 25)' },
      },
    },
  },
  {
    name: 'list_categories',
    description: 'All Remotive categories with slug and name.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_company',
    description: 'Company profile + active listings by company slug.',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string', description: 'Remotive company slug' } },
      required: ['slug'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search': {
      const params = new URLSearchParams();
      if (args.search) params.set('search', String(args.search));
      if (args.category) params.set('category', String(args.category));
      if (args.company_name) params.set('company_name', String(args.company_name));
      if (args.limit !== undefined) params.set('limit', String(Math.max(1, args.limit as number)));
      return remotiveGet(`/remote-jobs?${params}`);
    }
    case 'list_categories':
      return remotiveGet('/remote-jobs/categories');
    case 'get_company':
      return remotiveGet(`/companies/${encodeURIComponent(reqStr(args, 'slug', '"github"'))}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function remotiveGet(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'pipeworx-mcp-remotive/1.0 (+https://pipeworx.io)',
    },
  });
  if (res.status === 404) throw new Error('Remotive: not found');
  if (res.status === 429) throw new Error('Remotive: rate-limit (HTTP 429)');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Remotive error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
