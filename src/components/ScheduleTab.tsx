import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { parseSchedule } from '../utils/parseAdditionalData';
import { Schedule } from '../types/moutamadris';

interface ScheduleTabProps {
  credentials: {
    username: string;
    password: string;
    year: string;
  };
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ credentials }) => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);
    setSchedule(null);
    
    try {
      const res = await axios.post('/api/fetch-schedule', credentials);
      const parsedData = parseSchedule(res.data.rawHTML);
      setSchedule(parsedData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={fetchSchedule}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Schedule'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {schedule && schedule.items && schedule.items.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>Class Schedule</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Room</TableCell>
                  <TableCell>Day</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedule.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.subject}</TableCell>
                    <TableCell>{item.teacher}</TableCell>
                    <TableCell>{item.room}</TableCell>
                    <TableCell>{item.day}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {schedule && (!schedule.items || schedule.items.length === 0) && (
        <Alert severity="info">
          Schedule data could not be parsed from the response. 
          The data might be in a different format than expected.
        </Alert>
      )}
    </Box>
  );
};

export default ScheduleTab;