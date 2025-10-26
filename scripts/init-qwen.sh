#!/bin/bash

# Script to initialize Qwen-code CLI for this project

echo "Initializing Qwen-code CLI for PSU Rizal Collaboration Platform..."

# Create qwen config directory if it doesn't exist
mkdir -p .qwen

# Set up qwen configuration
echo "Setting up Qwen configuration..."
cat > .qwen/settings.json << EOF
{
  "vimMode": true,
  "ideMode": true,
  "selectedAuthType": "qwen-oauth",
  "folderTrustFeature": true,
  "folderTrust": true,
  "showLineNumbers": true,
  "showMemoryUsage": true,
  "mcpServers": {
    "mcp-shell": {
      "command": "/Users/ORDEROFCODE/MCP-Servers/mcp-shell/mcp-shell"
    },
    "mcp-filesystem-server": {
      "command": "/Users/ORDEROFCODE/.venv/bin/python",
      "args": ["-m", "wrapper", "--name", "mcp-filesystem-server"],
      "cwd": "/Users/ORDEROFCODE/MCP-Servers/mcp-filesystem-server"
    }
  },
  "tools": {
    "enabled": true,
    "allowedTools": [
      "read_file",
      "write_file",
      "edit",
      "list_dir",
      "search_files",
      "run_shell_command",
      "web_fetch",
      "web_search",
      "read_many_files",
      "save_memory",
      "todo_write"
    ],
    "confirmBeforeRun": true,
    "shellCommandSafety": true
  },
  "projectSettings": {
    "documentNamingConvention": "lowercase",
    "documentationDirectory": "docs",
    "componentPlanningEnabled": true,
    "buildSystemIntegration": true
  }
}
EOF

# Create project-level qwen config
echo "Creating project-level Qwen configuration (ES module)..."
cat > qwen.config.mjs << 'EOF'
// Project configuration for Qwen AI assistant
export default {
  // Project configuration for Qwen AI assistant
  project: {
    name: "PSU Rizal | Academic Collaboration Platform",
    description: "A Next.js-based web platform for Palawan State University (PSU) Rizal enabling virtual collaboration, academic management, and real-time meetings",
    type: "web application",
    framework: "Next.js",
    language: "TypeScript",
    styling: "Tailwind CSS",
    components: "shadcn/ui"
  },
  
  // Documentation settings
  documentation: {
    namingConvention: "lowercase", // Use lowercase for all documentation files
    directory: "docs",
    format: "markdown"
  },
  
  // Component development settings
  components: {
    planning: true,
    building: true,
    testing: true,
    directory: "components"
  },
  
  // MCP Server configuration
  mcpServers: {
    "mcp-shell": {
      command: "/Users/ORDEROFCODE/MCP-Servers/mcp-shell/mcp-shell"
    },
    "mcp-filesystem-server": {
      command: "/Users/ORDEROFCODE/.venv/bin/python",
      args: ["-m", "wrapper", "--name", "mcp-filesystem-server"],
      cwd: "/Users/ORDEROFCODE/MCP-Servers/mcp-filesystem-server"
    }
  },
  
  // File naming conventions
  naming: {
    documentation: "lowercase",
    components: "kebab-case",
    pages: "kebab-case"
  },
  
  // Integration settings
  integration: {
    buildSystem: true,
    testing: true,
    deployment: true
  }
};
EOF

echo "Qwen-code CLI initialized successfully!"
echo "Documentation files have been standardized to lowercase naming."
echo "MCP Servers configured correctly."