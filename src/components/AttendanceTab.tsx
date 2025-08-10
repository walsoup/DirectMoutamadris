import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { parseAttendance } from '../utils/parseAdditionalData';
import { AttendanceData } from '../types/moutamadris';

interface AttendanceTabProps {
  credentials: {
    username: string;
    password: string;
    year: string;
  };
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ credentials }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    setAttendanceData(null);
    
    try {
      const res = await axios.post('/api/fetch-attendance', credentials);
      const parsedData = parseAttendance(res.data.rawHTML);
      setAttendanceData(parsedData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={fetchAttendance}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Attendance'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {attendanceData && (
        <Box>
          {/* Summary Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Attendance Summary
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {attendanceData.totalAbsences !== undefined && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Total Absences</Typography>
                    <Typography variant="h4" color="error">{attendanceData.totalAbsences}</Typography>
                  </Box>
                )}
                
                {attendanceData.justifiedAbsences !== undefined && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Justified</Typography>
                    <Typography variant="h4" color="warning.main">{attendanceData.justifiedAbsences}</Typography>
                  </Box>
                )}
                
                {attendanceData.unjustifiedAbsences !== undefined && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Unjustified</Typography>
                    <Typography variant="h4" color="error">{attendanceData.unjustifiedAbsences}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Records Table */}
          {attendanceData.records && attendanceData.records.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Attendance Records</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Reason</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceData.records.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.subject}</TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>
                          {record.justified !== undefined && (
                            <Chip
                              label={record.justified ? 'Justified' : 'Unjustified'}
                              color={record.justified ? 'success' : 'error'}
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>{record.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {(!attendanceData.records || attendanceData.records.length === 0) && 
           attendanceData.totalAbsences === undefined && (
            <Alert severity="info">
              Attendance data could not be parsed from the response. 
              The data might be in a different format than expected.
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AttendanceTab;