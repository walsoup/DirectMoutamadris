import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { parseHomework } from '../utils/parseAdditionalData';
import { HomeworkItem } from '../types/moutamadris';

interface HomeworkTabProps {
  credentials: {
    username: string;
    password: string;
    year: string;
  };
}

const HomeworkTab: React.FC<HomeworkTabProps> = ({ credentials }) => {
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHomework = async () => {
    setLoading(true);
    setError(null);
    setHomework([]);
    
    try {
      const res = await axios.post('/api/fetch-homework', credentials);
      const parsedData = parseHomework(res.data.rawHTML);
      setHomework(parsedData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch homework');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'default';
    const s = status.toLowerCase();
    if (s.includes('complete') || s.includes('done')) return 'success';
    if (s.includes('pending') || s.includes('todo')) return 'warning';
    if (s.includes('overdue') || s.includes('late')) return 'error';
    return 'default';
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={fetchHomework}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Homework'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {homework.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" gutterBottom>
            Homework & Assignments ({homework.length})
          </Typography>
          
          {homework.map((item, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="h3">
                      {item.title || 'Untitled Assignment'}
                    </Typography>
                    {item.subject && (
                      <Chip 
                        label={item.subject} 
                        size="small" 
                        variant="outlined" 
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                  {item.status && (
                    <Chip 
                      label={item.status} 
                      size="small" 
                      color={getStatusColor(item.status)}
                    />
                  )}
                </Box>
                
                {item.description && (
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  {item.assignedDate && (
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Assigned: {item.assignedDate}
                      </Typography>
                    </Box>
                  )}
                  {item.dueDate && (
                    <Box>
                      <Typography variant="caption" color="error">
                        Due: {item.dueDate}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {homework.length === 0 && !loading && !error && (
        <Alert severity="info">
          No homework found. Click &ldquo;Fetch Homework&rdquo; to load data.
        </Alert>
      )}
      
      {homework.length === 0 && !loading && error === null && (
        <Alert severity="info">
          Homework data could not be parsed from the response. 
          The data might be in a different format than expected.
        </Alert>
      )}
    </Box>
  );
};

export default HomeworkTab;