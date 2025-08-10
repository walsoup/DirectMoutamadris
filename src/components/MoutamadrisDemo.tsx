import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  createTheme,
  ThemeProvider,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { teal, blue } from '@mui/material/colors';

// Import tab components (we'll use mock components for demo)
import DemoGradesTab from './DemoGradesTab';

const theme = createTheme({
  palette: {
    primary: { main: blue[700] },
    secondary: { main: teal[500] },
    background: { default: '#f4fafd' },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MoutamadrisDemo: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [demoMode, setDemoMode] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const mockStudentInfo = {
    name: "Ahmed Ben Ali",
    massarCode: "A123456789",
    establishment: "Lycée Mohammed V",
    level: "2ème année Baccalauréat",
    class: "2BAC SC MATHS A",
    academicYear: "2024/2025"
  };

  const mockAnnouncements = [
    {
      title: "Examen de Mathématiques",
      content: "L'examen de mathématiques aura lieu le 15 janvier 2025. Veuillez vous présenter avec votre carte d'étudiant.",
      date: "2025-01-08",
      author: "Prof. Rachid"
    },
    {
      title: "Réunion Parents-Enseignants", 
      content: "Une réunion avec les parents est prévue le 20 janvier pour discuter des résultats du premier semestre.",
      date: "2025-01-05",
      author: "Administration"
    }
  ];

  const mockHomework = [
    {
      subject: "Mathématiques",
      title: "Exercices Chapitre 5: Fonctions",
      description: "Résoudre les exercices 1 à 10 page 85",
      dueDate: "2025-01-15",
      assignedDate: "2025-01-08",
      status: "pending"
    },
    {
      subject: "Physique",
      title: "Rapport de TP: Optique",
      description: "Rédiger un rapport sur l'expérience d'optique réalisée en classe",
      dueDate: "2025-01-12",
      assignedDate: "2025-01-05",
      status: "completed"
    }
  ];

  if (!demoMode) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
          <Container maxWidth="md">
            <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h3" color="primary" fontWeight={700} gutterBottom align="center">
                MoutaMadris Portal - Demo
              </Typography>
              <Typography variant="subtitle1" color="secondary" align="center" mb={3}>
                Comprehensive student information system
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <TextField
                  label="Massar Code (e.g., A123456789@taalim.ma)"
                  variant="outlined"
                  fullWidth
                  disabled
                  value="demo@taalim.ma"
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  disabled
                  value="•••••••••"
                />
                <FormControl fullWidth disabled>
                  <InputLabel>Academic Year</InputLabel>
                  <Select value="2024/2025" label="Academic Year">
                    <MenuItem value="2024/2025">2024/2025</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth disabled>
                  <InputLabel>Semester</InputLabel>
                  <Select value="1" label="Semester">
                    <MenuItem value="1">Semester 1</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={demoMode}
                    onChange={(e) => setDemoMode(e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Demo Mode (View all features with sample data)"
              />

              <Button
                onClick={() => setDemoMode(true)}
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                View Demo Portal
              </Button>

              <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                This demo shows all available MoutaMadris functions with sample data
              </Typography>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Paper elevation={4} sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight={600}>
                MoutaMadris Portal - Demo
              </Typography>
              <Button onClick={() => setDemoMode(false)} color="secondary" variant="outlined">
                Exit Demo
              </Button>
            </Box>
            
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Student Info" />
              <Tab label="Grades" />
              <Tab label="Attendance" />
              <Tab label="Schedule" />
              <Tab label="Announcements" />
              <Tab label="Homework" />
            </Tabs>

            <TabPanel value={currentTab} index={0}>
              <Box>
                <Typography variant="h5" gutterBottom color="primary">Student Information</Typography>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                      <Typography variant="body1">{mockStudentInfo.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Massar Code</Typography>
                      <Typography variant="body1">{mockStudentInfo.massarCode}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Establishment</Typography>
                      <Typography variant="body1">{mockStudentInfo.establishment}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Level</Typography>
                      <Typography variant="body1">{mockStudentInfo.level}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Class</Typography>
                      <Typography variant="body1">{mockStudentInfo.class}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Academic Year</Typography>
                      <Typography variant="body1">{mockStudentInfo.academicYear}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <DemoGradesTab />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <Box>
                <Typography variant="h5" gutterBottom color="primary">Attendance Records</Typography>
                <Paper sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Summary</Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box textAlign="center">
                      <Typography variant="h3" color="error">3</Typography>
                      <Typography variant="caption">Total Absences</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h3" color="warning.main">2</Typography>
                      <Typography variant="caption">Justified</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h3" color="error">1</Typography>
                      <Typography variant="caption">Unjustified</Typography>
                    </Box>
                  </Box>
                </Paper>
                <Typography variant="body2" color="text.secondary">
                  ✅ Attendance tracking system implemented and ready to fetch real data
                </Typography>
              </Box>
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <Box>
                <Typography variant="h5" gutterBottom color="primary">Class Schedule</Typography>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Weekly Schedule</Typography>
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography><strong>Monday 08:00-10:00:</strong> Mathématiques - Prof. Rachid - Salle 201</Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography><strong>Monday 10:15-12:15:</strong> Physique - Prof. Fatima - Lab 1</Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography><strong>Tuesday 08:00-09:00:</strong> Français - Prof. Hassan - Salle 105</Typography>
                    </Box>
                  </Box>
                </Paper>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  ✅ Schedule system implemented and ready to fetch real timetable data
                </Typography>
              </Box>
            </TabPanel>

            <TabPanel value={currentTab} index={4}>
              <Box>
                <Typography variant="h5" gutterBottom color="primary">Announcements</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {mockAnnouncements.map((announcement, index) => (
                    <Paper key={index} sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6">{announcement.title}</Typography>
                        <Typography variant="caption" color="primary">{announcement.date}</Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mb: 1 }}>{announcement.content}</Typography>
                      <Typography variant="caption" color="textSecondary">By: {announcement.author}</Typography>
                    </Paper>
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  ✅ Announcements system implemented and ready to fetch real school announcements
                </Typography>
              </Box>
            </TabPanel>

            <TabPanel value={currentTab} index={5}>
              <Box>
                <Typography variant="h5" gutterBottom color="primary">Homework & Assignments</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {mockHomework.map((item, index) => (
                    <Paper key={index} sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6">{item.title}</Typography>
                        <Box sx={{ 
                          px: 2, 
                          py: 0.5, 
                          borderRadius: 1, 
                          bgcolor: item.status === 'completed' ? 'success.light' : 'warning.light',
                          color: item.status === 'completed' ? 'success.dark' : 'warning.dark'
                        }}>
                          <Typography variant="caption">{item.status}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" color="primary" gutterBottom>{item.subject}</Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>{item.description}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Assigned: {item.assignedDate} | Due: {item.dueDate}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  ✅ Homework tracking system implemented and ready to fetch real assignments
                </Typography>
              </Box>
            </TabPanel>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default MoutamadrisDemo;