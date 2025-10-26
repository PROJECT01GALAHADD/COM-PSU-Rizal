// Minimal Replit Object Storage wrapper (placeholder)
// See: https://github.com/replit/replit-object-storage-typescript

// Replit Object Storage client-side adapter that proxies uploads to our Next.js API route
// Server-side uploads avoid Buffer issues in browser and centralize credentials handling

export type ReplitObjectStorageConfig = {
  bucket?: string
}

export class ReplitObjectStorage {
  private config: ReplitObjectStorageConfig

  constructor(config: ReplitObjectStorageConfig = {}) {
    this.config = config
  }

  async putObject(key: string, data: Blob | File | ArrayBuffer | Uint8Array) {
    const form = new FormData()
    // Normalize data to a Blob/File for formData
    let file: Blob | File
    if (data instanceof Blob) {
      file = data
    } else if (data instanceof Uint8Array) {
      file = new Blob([data])
    } else if (data instanceof ArrayBuffer) {
      file = new Blob([new Uint8Array(data)])
    } else {
      // Assume File
      file = data as File
    }
    form.append('file', file)
    if (key) form.append('key', key)
    if (this.config.bucket) form.append('bucket', this.config.bucket)

    const res = await fetch('/api/storage/upload', {
      method: 'POST',
      body: form,
    })
    const body = await res.json().catch(() => ({}))
    return { ok: res.ok, key: body?.key || key, url: body?.url }
  }

  async getObjectUrl(key: string) {
    // This might ultimately depend on bucket policy and CDN;
    // Here we rely on the server to return the final URL after upload.
    return `/objects/${encodeURIComponent(key)}`
  }
}

export async function uploadViaAPI(file: File, key?: string, bucket?: string) {
  const client = new ReplitObjectStorage({ bucket })
  return client.putObject(key || file.name, file)
}