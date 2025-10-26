import { NextRequest, NextResponse } from "next/server";
import { Client } from "@replit/object-storage";
import { verifyAuth } from "@/lib/auth/api-auth";

const storage = new Client();

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const result = await storage.downloadAsBytes(filename);

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error.message || "File not found" },
        { status: 404 }
      );
    }

    const ext = filename.split('.').pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'zip': 'application/zip',
    };
    const contentType = ext ? (contentTypeMap[ext] || 'application/octet-stream') : 'application/octet-stream';

    return new NextResponse(result.value as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename.split('/').pop()}"`,
      },
    });
  } catch (error: any) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to download file" },
      { status: 500 }
    );
  }
}
