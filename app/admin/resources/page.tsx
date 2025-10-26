'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
export default function AdminResourcesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string>('')

  const onUpload = async () => {
    if (!file) {
      setMessage('Select a file first')
      return
    }
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('name', `uploads/${file.name}`)
      const res = await fetch('/api/storage/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Upload failed')
      setMessage('Uploaded!')
    } catch (e) {
      setMessage('Upload failed')
    }
  }

  return (
    <div className="p-6">
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Admin Resources (Object Storage demo)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <input
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="text-white"
            />
            <Button onClick={onUpload} className="bg-orange-600 hover:bg-orange-500 text-white">
              Upload
            </Button>
            {message && <p className="text-sm text-orange-300">{message}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}