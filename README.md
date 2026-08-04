# @pipeworx/remotive

Remotive MCP — curated remote-only job board. No auth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search(search?, category?, company_name?, limit?)` — job listings
- `list_categories()` — available categories (software-dev, design, marketing, ...)
- `get_company(slug)` — company profile + active listings

## Data source

`https://remotive.com/api/remote-jobs` — keyless, public REST.

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "remotive": {
      "url": "https://gateway.pipeworx.io/remotive/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Remotive data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
