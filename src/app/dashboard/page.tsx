'use client';

import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, TextField } from '@mui/material';
import FormDialog from '@/components/FormDialog';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function DashboardPage() {
  const { projects, createProject } = useStore();
  // Dialog box Operation state..
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreate = async () => {
    if (!name) return;
    await createProject(name, desc);
    setOpen(false);
    setName('');
    setDesc('');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Projects</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>New Project</Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{project.name}</Typography>
                <Typography variant="body2" color="text.secondary">{project.description}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} href={`/dashboard/projects/${project.id}`}>Open Board</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {projects.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography className='text-gray-500'>No projects yet. Create one to get started.</Typography>
          </Grid>
        )}
      </Grid>

      <FormDialog
        open={open}
        onClose={() => setOpen(false)}
        title="New Project"
        onSubmit={handleCreate}
        submitLabel="Create"
      >
        <TextField
          autoFocus
          margin="dense"
          label="Project Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </FormDialog>
    </Box>
  );
}
