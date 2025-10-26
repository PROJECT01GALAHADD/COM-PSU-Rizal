import { put as vercelPut, del as vercelDel } from '@vercel/blob';
import { Client } from '@replit/object-storage';

type StorageProvider = 'vercel' | 'replit' | 'local';

interface StorageAdapter {
  upload(file: File | Buffer, key: string): Promise<string>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}

export function createStorageAdapter(provider: StorageProvider): StorageAdapter {
  switch (provider) {
    case 'vercel':
      return {
        async upload(file, key) {
          const blob = await vercelPut(key, file, {
            access: 'public',
            addRandomSuffix: false,
          });
          return blob.url;
        },
        async delete(key) {
          await vercelDel(key);
        },
        getUrl(key) {
          return `${process.env.BLOB_READ_WRITE_TOKEN}/${key}`;
        }
      };

    case 'replit':
      return {
        async upload(file, key) {
          const client = new Client();
          const buffer = file instanceof Buffer 
            ? file 
            : Buffer.from(await file.arrayBuffer());
          await client.uploadFromBytes(key, buffer);
          return `/api/files/${key}`;
        },
        async delete(key) {
          const client = new Client();
          await client.delete(key);
        },
        getUrl(key) {
          return `/api/files/${key}`;
        }
      };

    case 'local':
      return {
        async upload(file, key) {
          return `/tmp/uploads/${key}`;
        },
        async delete(key) {
          // Local deletion logic
        },
        getUrl(key) {
          return `/tmp/uploads/${key}`;
        }
      };
  }
}

export function getStorageProvider(): StorageProvider {
  if (process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN) return 'vercel';
  if (process.env.REPL_ID) return 'replit';
  return 'local';
}

export const storage = createStorageAdapter(getStorageProvider());
