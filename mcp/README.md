# SatisfactoryTools MCP Server

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that exposes SatisfactoryTools data and production planning to AI assistants. Query items, recipes, and buildings, calculate production chains, and read/write `.sft` save files — all from your AI assistant.

## Requirements

Node.js 18 or higher.

## Installation

The server is published to npm as `satisfactory-tools-mcp`. No cloning required — game data is bundled inside the package.

---

## Setup by client

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "satisfactory-tools": {
      "command": "npx",
      "args": ["-y", "satisfactory-tools-mcp"]
    }
  }
}
```

Restart Claude Desktop after saving.

---

### Claude Code (CLI)

```bash
claude mcp add --scope user satisfactory-tools -- npx -y satisfactory-tools-mcp
```

The `--scope user` makes it available across all your projects. Verify with `claude mcp list`, or check live status inside a session with `/mcp`.

---

### Cursor

Add to `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "satisfactory-tools": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "satisfactory-tools-mcp"]
    }
  }
}
```

---

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json` (macOS/Linux) or `%USERPROFILE%\.codeium\windsurf\mcp_config.json` (Windows):

```json
{
  "mcpServers": {
    "satisfactory-tools": {
      "command": "npx",
      "args": ["-y", "satisfactory-tools-mcp"]
    }
  }
}
```

---

### VS Code (GitHub Copilot)

Add to `.vscode/mcp.json` in your project root, or open the command palette and run **MCP: Open User Configuration** for a global install:

```json
{
  "servers": {
    "satisfactory-tools": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "satisfactory-tools-mcp"]
    }
  }
}
```

---

### Zed

Add to your Zed user settings (`~/Library/Application Support/Zed/settings.json` on macOS):

```json
{
  "context_servers": {
    "satisfactory-tools": {
      "command": "npx",
      "args": ["-y", "satisfactory-tools-mcp"]
    }
  }
}
```

---

### Continue.dev

Add to your `config.yaml` (agent mode required):

```yaml
mcpServers:
  - name: satisfactory-tools
    type: stdio
    command: npx
    args:
      - "-y"
      - "satisfactory-tools-mcp"
```

---

### ChatGPT

OpenAI added MCP support in 2025. See the [OpenAI MCP documentation](https://developers.openai.com/apps-sdk/concepts/mcp-server) for setup instructions.

---

## Available Tools

### Querying game data

| Tool | Description |
|------|-------------|
| `search_items` | Search items by name; filter by liquid/solid or sinkable |
| `get_item` | Full item details by className or slug |
| `get_item_recipes` | All recipes that produce an item (includes per-minute rates) |
| `get_item_usages` | All recipes that consume an item as an ingredient |
| `search_recipes` | Filter recipes by name, alternate flag, or producing building |
| `get_recipe` | Full recipe details by className or slug |
| `search_buildings` | Search buildings; filter to manufacturer machines only |
| `get_building` | Full building details including runnable recipes |
| `search_schematics` | Filter schematics by type, tier, or MAM flag |
| `get_schematic` | Full schematic details with resolved item/recipe names |
| `get_raw_resources` | All raw resources with default world max per-minute amounts |

### Production planning

| Tool | Description |
|------|-------------|
| `calculate_production` | Calculate an optimal production chain via the solver API. Returns machine counts per recipe. |

### Save files

| Tool | Description |
|------|-------------|
| `read_sft_file` | Read a `.sft` export file and return its tabs with human-readable names |
| `write_sft_file` | Write a `.sft` file importable by the SatisfactoryTools web app |

All tools accept an optional `version` parameter (`"1.0"`, `"0.8"`, `"1.0-ficsmas"`) defaulting to `"1.0"`.

---

## Example prompts

- *"What recipes produce reinforced iron plates, and how many constructors do I need for 30/min?"*
- *"Read my factory.sft file and tell me what I'm producing"*
- *"Plan a production line for 10 computers per minute and save it as computers.sft"*
- *"What tier do I need to research to unlock the Assembler?"*
- *"Which alternate recipes reduce iron ore consumption for iron rods?"*

---

## Developer setup

If you're working on the MCP server from this repo:

```bash
cd mcp
npm install
npm run build   # outputs dist/index.js (~5MB, game data bundled inline)
```

The build uses [esbuild](https://esbuild.github.io/) to bundle TypeScript and all three game data JSON files into a single executable. No external data files are needed at runtime.

To use your local build instead of the npm version, replace `npx -y satisfactory-tools-mcp` with `node /absolute/path/to/SatisfactoryTools/mcp/dist/index.js` in whichever config above applies to your client.

### Publishing

```bash
cd mcp
npm publish
```

The `files` field in `package.json` ensures only `dist/` is included in the published package.

### Rebuilding after game updates

When Satisfactory releases an update, regenerate the game data from the repo root (see the root README), then rebuild and republish:

```bash
# from repo root
npm run parseDocs

# then
cd mcp && npm run build && npm publish
```
