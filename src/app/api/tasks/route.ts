import { NextResponse } from 'next/server';
import { db, Task } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) return NextResponse.json({ error: 'Project ID required' }, { status: 400 });

  // Verify project have existing user or not ?
  const project = db.projects.find(p => p.id === projectId && p.userId === userId);
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  const tasks = db.tasks.filter((t) => t.projectId === projectId);
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, description, status, projectId } = await request.json();
    if (!title || !projectId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const project = db.projects.find(p => p.id === projectId && p.userId === userId);
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: status || 'TODO',
      projectId,
      userId,
      createdAt: new Date().toISOString(),
    };

    db.tasks.push(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, title, description, status } = await request.json();
    const taskIndex = db.tasks.findIndex(t => t.id === id && t.userId === userId);

    if (taskIndex === -1) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const updatedTask = { ...db.tasks[taskIndex], title, description, status };
    db.tasks[taskIndex] = updatedTask;

    return NextResponse.json(updatedTask);
  } catch {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const userId = request.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const taskIndex = db.tasks.findIndex(t => t.id === id && t.userId === userId);
    if (taskIndex === -1) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    db.tasks.splice(taskIndex, 1);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
