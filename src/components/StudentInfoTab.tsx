import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';
import { parseStudentInfo } from '../utils/parseAdditionalData';
import { StudentInfo } from '../types/moutamadris';

interface StudentInfoTabProps {
  credentials: {
    username: string;
    password: string;
    year: string;
  };
}

const StudentInfoTab: React.FC<StudentInfoTabProps> = ({ credentials }) => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentInfo = async () => {
    setLoading(true);
    setError(null);
    setStudentInfo(null);
    
    try {
      const res = await axios.post('/api/fetch-student-info', credentials);
      const parsedData = parseStudentInfo(res.data.rawHTML);
      setStudentInfo(parsedData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch student information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={fetchStudentInfo}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Student Information'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {studentInfo && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Student Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
              {studentInfo.name && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                  <Typography variant="body1">{studentInfo.name}</Typography>
                </Box>
              )}
              
              {studentInfo.massarCode && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Massar Code</Typography>
                  <Typography variant="body1">{studentInfo.massarCode}</Typography>
                </Box>
              )}
              
              {studentInfo.establishment && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Establishment</Typography>
                  <Typography variant="body1">{studentInfo.establishment}</Typography>
                </Box>
              )}
              
              {studentInfo.level && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Level</Typography>
                  <Typography variant="body1">{studentInfo.level}</Typography>
                </Box>
              )}
              
              {studentInfo.class && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Class</Typography>
                  <Typography variant="body1">{studentInfo.class}</Typography>
                </Box>
              )}
              
              {studentInfo.academicYear && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Academic Year</Typography>
                  <Typography variant="body1">{studentInfo.academicYear}</Typography>
                </Box>
              )}
            </Box>
            
            {!studentInfo.name && !studentInfo.establishment && !studentInfo.level && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Student information could not be parsed from the response. 
                The data might be in a different format than expected.
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default StudentInfoTab;