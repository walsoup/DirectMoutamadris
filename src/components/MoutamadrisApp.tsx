import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Paper,
  createTheme,
  ThemeProvider,
  Tab,
  Tabs,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { teal, blue } from '@mui/material/colors';
import axios from 'axios';

// Import existing components and utilities
import GradesTab from './GradesTab';
import StudentInfoTab from './StudentInfoTab';
import AttendanceTab from './AttendanceTab';
import ScheduleTab from './ScheduleTab';
import AnnouncementsTab from './AnnouncementsTab';
import HomeworkTab from './HomeworkTab';

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

interface MoutamadrisForm {
  username: string;
  password: string;
  semester: string;
  year: string;
}

const MoutamadrisApp: React.FC = () => {
  const [form, setForm] = useState<MoutamadrisForm>({
    username: '',
    password: '',
    semester: '1',
    year: '2024/2025',
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const yearOptions = [
    '2015/2016', '2016/2017', '2017/2018', '2018/2019', '2019/2020',
    '2020/2021', '2021/2022', '2022/2023', '2023/2024', '2024/2025',
  ];

  const semesterOptions = [
    { value: '1', label: 'Semester 1' },
    { value: '2', label: 'Semester 2' },
    { value: '3', label: 'Moyenne Annuelle' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (event: any) => {
    const name = event.target.name as string;
    setForm({ ...form, [name]: event.target.value as string });
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test authentication with a simple API call
      await axios.post('/api/fetch-student-info', {
        username: form.username,
        password: form.password
      });
      
      setIsAuthenticated(true);
    } catch (err: any) {
      if (err.response?.data?.error === 'Login failed') {
        setError('Incorrect Massar code or password. Please try again.');
      } else {
        setError(err.response?.data?.error || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentTab(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    // Load credentials from localStorage on mount
    const saved = localStorage.getItem('massar-credentials');
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    // Save credentials to localStorage on change
    localStorage.setItem('massar-credentials', JSON.stringify(form));
  }, [form]);

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
          <Container maxWidth="md">
            <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h3" color="primary" fontWeight={700} gutterBottom align="center">
                MoutaMadris Portal
              </Typography>
              <Typography variant="subtitle1" color="secondary" align="center" mb={3}>
                Access all your student information in one place
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Massar Code (e.g., A123456789@taalim.ma)"
                  name="username"
                  value={form.username}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>Academic Year</InputLabel>
                  <Select
                    name="year"
                    value={form.year}
                    label="Academic Year"
                    onChange={handleSelectChange}
                  >
                    {yearOptions.map((year) => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Semester</InputLabel>
                  <Select
                    name="semester"
                    value={form.semester}
                    label="Semester"
                    onChange={handleSelectChange}
                  >
                    {semesterOptions.map((s) => (
                      <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  onClick={handleLogin}
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
              )}
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
                MoutaMadris Portal
              </Typography>
              <Button onClick={handleLogout} color="secondary" variant="outlined">
                Logout
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
              <StudentInfoTab credentials={form} />
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <GradesTab credentials={form} />
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
              <AttendanceTab credentials={form} />
            </TabPanel>
            <TabPanel value={currentTab} index={3}>
              <ScheduleTab credentials={form} />
            </TabPanel>
            <TabPanel value={currentTab} index={4}>
              <AnnouncementsTab credentials={form} />
            </TabPanel>
            <TabPanel value={currentTab} index={5}>
              <HomeworkTab credentials={form} />
            </TabPanel>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default MoutamadrisApp;