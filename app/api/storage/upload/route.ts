import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const name = form.get('name') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const objectName = name || `uploads/${file.name}`
    const buf = Buffer.from(await file.arrayBuffer())

    // Demo-mode bypass: simulate success without hitting Object Storage
    const isDemo = !!req.cookies.get('demo_auth')?.value || req.cookies.get('demo_mode')?.value === '1'
    if (isDemo) {
      return NextResponse.json({ ok: true, objectName, url: `/demo/${encodeURIComponent(objectName)}` })
    }

    // Dynamically import the Object Storage client to avoid type resolution issues
    let Client: any
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - suppress type resolution error when types are not installed yet
      const mod = await import('@replit/object-storage')
      Client = (mod as any).Client || (mod as any).default?.Client
    } catch (e) {
      return NextResponse.json(
        { error: 'Object Storage client not available. Ensure @replit/object-storage is installed.' },
        { status: 500 }
      )
    }

    const client = new Client()
    const { ok, error } = await client.uploadFromBytes(objectName, buf)
    if (!ok) {
      return NextResponse.json({ error: error || 'Upload failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, objectName })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}