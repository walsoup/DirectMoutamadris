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
import { parseAnnouncements } from '../utils/parseAdditionalData';
import { Announcement } from '../types/moutamadris';

interface AnnouncementsTabProps {
  credentials: {
    username: string;
    password: string;
  };
}

const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({ credentials }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    setAnnouncements([]);
    
    try {
      const res = await axios.post('/api/fetch-announcements', credentials);
      const parsedData = parseAnnouncements(res.data.rawHTML);
      setAnnouncements(parsedData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={fetchAnnouncements}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Announcements'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {announcements.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" gutterBottom>
            Announcements ({announcements.length})
          </Typography>
          
          {announcements.map((announcement, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h3">
                    {announcement.title || 'Untitled Announcement'}
                  </Typography>
                  {announcement.date && (
                    <Chip 
                      label={announcement.date} 
                      size="small" 
                      variant="outlined" 
                    />
                  )}
                </Box>
                
                {announcement.content && (
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {announcement.content}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {announcement.author && (
                    <Typography variant="caption" color="textSecondary">
                      By: {announcement.author}
                    </Typography>
                  )}
                  {announcement.priority && (
                    <Chip 
                      label={announcement.priority} 
                      size="small" 
                      color={announcement.priority.toLowerCase().includes('high') ? 'error' : 'default'}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {announcements.length === 0 && !loading && !error && (
        <Alert severity="info">
          No announcements found. Click "Fetch Announcements" to load data.
        </Alert>
      )}
      
      {announcements.length === 0 && !loading && error === null && (
        <Alert severity="info">
          Announcements could not be parsed from the response. 
          The data might be in a different format than expected.
        </Alert>
      )}
    </Box>
  );
};

export default AnnouncementsTab;