'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, Grid, Card, CardContent, Button, TextField, Select, MenuItem, Stack, IconButton } from '@mui/material';
import FormDialog from '@/components/FormDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useStore } from '@/store/useStore';
import { Task } from '@/lib/db';

const statusColors: Record<Task['status'], 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary'> = {
  'TODO': 'default',
  'IN_PROGRESS': 'info',
  'DONE': 'success',
};

export default function ProjectPage() {
  // Task Related State
  const { id } = useParams() as { id: string };
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, projects } = useStore();
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form Related State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState<Task['status']>('TODO');

  const project = projects.find(p => p.id === id);

  useEffect(() => {
    if (id) fetchTasks(id);
  }, [id, fetchTasks]);

  // Task Dialog handling - open
  const handleOpen = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDesc(task.description || '');
      setStatus(task.status);
    } else {
      setEditingTask(null);
      setTitle('');
      setDesc('');
      setStatus('TODO');
    }
    setOpen(true);
  };

  // Task Dialog handling - Save
  const handleSave = async () => {
    if (!title) return;
    if (editingTask) {
      await updateTask({ ...editingTask, title, description: desc, status });
    } else {
      await createTask(id, title, desc, status);
    }
    //For Close pass value false 
    setOpen(false);
  };

  const columns: Task['status'][] = ['TODO', 'IN_PROGRESS', 'DONE'];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">{project?.name || 'Project Board'}</Typography>
        <Typography variant="subtitle1" color="text.secondary">{project?.description}</Typography>
      </Box>

      <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 3 }}>Add Task</Button>

      <Grid container spacing={2}>
        {columns.map((columnStatus) => (
          <Grid size={{ xs: 12, md: 4 }} key={columnStatus}>
            <PaperWrapper status={columnStatus}>
              <Typography className='text-black' variant="h6" align="center" sx={{ mb: 2 }}>{columnStatus.replace('_', ' ')}</Typography>
              <Stack spacing={2}>
                {tasks.filter(t => t.status === columnStatus).map(task => (
                  <Card key={task.id} variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1">{task.title}</Typography>
                      {task.description && <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{task.description}</Typography>}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <IconButton size="small" onClick={() => handleOpen(task)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => deleteTask(task.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </PaperWrapper>
          </Grid>
        ))}
      </Grid>


      {/*Passinng Dialog box childer Component */}
      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
        onSubmit={handleSave}
      >
        <TextField fullWidth margin="dense" label="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <TextField fullWidth margin="dense" label="Description" multiline rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
        <Select
          fullWidth
          value={status}
          onChange={e => setStatus(e.target.value as Task['status'])}
          sx={{ mt: 2 }}
        >
          <MenuItem value="TODO">To Do</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="DONE">Done</MenuItem>
        </Select>
      </FormDialog>
    </Box>
  );
}

function PaperWrapper({ children, status }: { children: React.ReactNode, status: string }) {
  const bgColors = {
    'TODO': '#f5f5f5',
    'IN_PROGRESS': '#e3f2fd',
    'DONE': '#e8f5e9'
  };
  return (
    <Box sx={{
      bgcolor: bgColors[status as keyof typeof bgColors] || 'white',
      p: 2,
      borderRadius: 1,
      minHeight: 400
    }}>
      {children}
    </Box>
  );
}
