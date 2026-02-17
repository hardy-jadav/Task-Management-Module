'use client';

import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Toolbar, Typography } from '@mui/material';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const drawerWidth = 240;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, projects, fetchProjects } = useStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton href="/dashboard" component={Link}>
                <ListItemText primary="Overview" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem>
              <Typography variant="overline" color="text.secondary">Projects</Typography>
            </ListItem>
            {projects.map((project) => (
              <ListItem key={project.id} disablePadding>
                <ListItemButton href={`/dashboard/projects/${project.id}`} component={Link}>
                  <ListItemText primary={project.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
