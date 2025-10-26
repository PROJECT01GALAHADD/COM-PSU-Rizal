import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Optional: If you have user-level config, define it here
export const configSchema = z.object({
	debug: z.boolean().default(false).describe("Enable debug logging"),
	baseUrl: z.string().default("http://localhost:3000").describe(
		"Base URL of the Next.js app",
	),
});

export default function createServer({
	config,
}: {
	config: z.infer<typeof configSchema>; // your server configuration
}) {
	const server = new McpServer({
		name: "Say Hello",
		version: "1.0.0",
	});

	// Add a tool
	server.registerTool(
		"hello",
		{
			title: "Hello Tool",
			description: "Say hello to someone",
			inputSchema: { name: z.string().describe("Name to greet") },
		},
		async ({ name }) => ({
			content: [
				{
					type: "text",
					text: config.debug
						? `DEBUG: Hello ${name}`
						: `Hello, ${name}!`, // use provided config
				},
			],
		}),
	);

	// Tool: Query Next.js API
	server.registerTool(
		"next_api_request",
		{
			title: "Next.js API Request",
			description:
				"Perform HTTP requests against the local Next.js API routes",
			inputSchema: {
				method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"])
					.describe("HTTP method"),
				path: z.string().describe("API path or absolute URL"),
				headers: z.record(z.string()).optional().describe(
					"Optional headers",
				),
				body: z.any().optional().describe(
					"Optional request body; object will be JSON-stringified unless body is string",
				),
			},
		},
		async ({ method, path, headers = {}, body }) => {
			const url = path.startsWith("http")
				? path
				: `${config.baseUrl}${path}`;
			const init: RequestInit = { method };
			const h: Record<string, string> = { ...headers };
			if (body !== undefined) {
				if (typeof body === "string") {
					init.body = body;
				} else {
					init.body = JSON.stringify(body);
					h["Content-Type"] = h["Content-Type"] || "application/json";
				}
			}
			init.headers = h;
			const res = await fetch(url, init);
			const contentType = res.headers.get("content-type") || "";
			let payload: string;
			if (contentType.includes("application/json")) {
				payload = JSON.stringify(await res.json(), null, 2);
			} else {
				payload = await res.text();
			}
			return {
				content: [
					{
						type: "text",
						text:
							`Status: ${res.status}\nURL: ${url}\n\n${payload}`,
					},
				],
			};
		},
	);

	// Add a resource
	server.registerResource(
		"hello-world-history",
		"history://hello-world",
		{
			title: "Hello World History",
			description:
				"The origin story of the famous 'Hello, World' program",
		},
		async (uri) => ({
			contents: [
				{
					uri: uri.href,
					text:
						'"Hello, World" first appeared in a 1972 Bell Labs memo by Brian Kernighan and later became the iconic first program for beginners in countless languages.',
					mimeType: "text/plain",
				},
			],
		}),
	);

	// Add a prompt
	server.registerPrompt(
		"greet",
		{
			title: "Hello Prompt",
			description: "Say hello to someone",
			argsSchema: {
				name: z.string().describe("Name of the person to greet"),
			},
		},
		async ({ name }) => {
			return {
				messages: [
					{
						role: "user",
						content: {
							type: "text",
							text: `Say hello to ${name}`,
						},
					},
				],
			};
		},
	);

	return server.server;
}
