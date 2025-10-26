import { flagsConfig, defaultFlags } from '@/lib/flags/provider';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    definitions: flagsConfig,
    values: defaultFlags,
  });
}
