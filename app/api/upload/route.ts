import { NextRequest, NextResponse } from "next/server";
import { Client } from "@replit/object-storage";
import { verifyAuth } from "@/lib/auth/api-auth";

const storage = new Client();

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "uploads";
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${folder}/${timestamp}-${sanitizedName}`;

    const result = await storage.uploadFromBytes(filename, buffer);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    return NextResponse.json({
      success: true,
      filename,
      downloadPath: `/api/download?filename=${encodeURIComponent(filename)}`,
      size: file.size,
      type: file.type,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const prefix = searchParams.get("prefix");

    const result = await storage.list({ prefix: prefix || undefined });

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    return NextResponse.json({ files: result.value });
  } catch (error: any) {
    console.error("List files error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list files" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    const result = await storage.delete(filename);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete file" },
      { status: 500 }
    );
  }
}
