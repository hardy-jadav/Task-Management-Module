import { NextResponse } from 'next/server';
import { db, Project } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import * as jose from 'jose';

const secret = new TextEncoder().encode('secret-key-change-me');

async function getUser(request: Request): Promise<string | null> {
  const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
  if (!token) return null;
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload.sub as string;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userProjects = db.projects.filter((p) => p.userId === userId);
  return NextResponse.json(userProjects);
}

export async function POST(request: Request) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description } = await request.json();
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
      userId,
      createdAt: new Date().toISOString(),
    };

    db.projects.push(newProject);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
