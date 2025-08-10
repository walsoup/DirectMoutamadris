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
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';
import { parseMassarGrades } from '../utils/parseMassarGrades';
import { Chart, registerables } from 'chart.js';
import { saveAs } from 'file-saver';

interface GradesTabProps {
  credentials: {
    username: string;
    password: string;
    semester: string;
    year: string;
  };
}

const GradesTab: React.FC<GradesTabProps> = ({ credentials }) => {
  const [parsed, setParsed] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chartRef = React.useRef<HTMLCanvasElement | null>(null);

  const fetchGrades = async () => {
    setLoading(true);
    setError(null);
    setParsed(null);
    
    try {
      const res = await axios.post('/api/fetch-grades', credentials);
      const parsedData = parseMassarGrades(res.data.rawHTML);
      setParsed(parsedData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch grades');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (parsed && chartRef.current && parsed.examRows.length > 0) {
      Chart.register(...registerables);
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;
      
      // Destroy previous chart instance if exists
      if ((window as any).massarChart) {
        (window as any).massarChart.destroy();
      }
      
      (window as any).massarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: parsed.examRows.map((row: any) => row.matiere),
          datasets: [
            {
              label: 'Notes CC',
              data: parsed.examRows.map((row: any) => parseFloat(row.noteCC.replace(',', '.')) || 0),
              backgroundColor: 'rgba(33, 150, 243, 0.2)',
              borderColor: 'rgba(33, 150, 243, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(33, 150, 243, 1)',
            },
            {
              label: 'Note Moyenne Classe',
              data: parsed.examRows.map((row: any) => parseFloat(row.noteMoyClasse.replace(',', '.')) || 0),
              backgroundColor: 'rgba(0, 150, 136, 0.2)',
              borderColor: 'rgba(0, 150, 136, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(0, 150, 136, 1)',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Comparatif Notes' },
          },
          scales: {
            r: {
              min: 0,
              max: 20,
              ticks: { stepSize: 2 },
            },
          },
        },
      });
    }
  }, [parsed]);

  const downloadCSV = () => {
    if (!parsed) return;
    
    const escape = (v: string) => '"' + (v || '').replace(/"/g, '""') + '"';
    const toCSV = (rows: any[], headers: string[]): string => {
      const csvRows = [headers.map(escape).join(',')];
      for (const row of rows) {
        csvRows.push(headers.map(h => escape(row[h] || '')).join(','));
      }
      return csvRows.join('\n');
    };

    const examHeaders = ['matiere', 'noteCC', 'coefficient', 'noteMax', 'noteMoyClasse', 'noteMin', 'noteExam'];
    const ccHeaders = ['matiere', 'Contrôle 1', 'Contrôle 2', 'Contrôle 3', 'Contrôle 4', 'Activités intégrées'];
    
    const ccRows = parsed.ccRows.map((row: any) => {
      const out: any = { matiere: row.matiere };
      row.notes.forEach((n: string, i: number) => { out[ccHeaders[i + 1]] = n; });
      return out;
    });
    
    let csv = 'Notes Controls Continues\n';
    csv += toCSV(ccRows, ccHeaders) + '\n\nNotes Examens\n';
    csv += toCSV(parsed.examRows, examHeaders);
    
    saveAs(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'massar-grades.csv');
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          onClick={fetchGrades}
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Grades'}
        </Button>
        {parsed && (
          <Button onClick={downloadCSV} variant="outlined">
            Export CSV
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {parsed && (
        <Box>
          {/* Summary Card */}
          <Card sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                {parsed.summary.etablissement}
              </Typography>
              <Typography variant="body1">
                <b>Niveau:</b> {parsed.summary.niveau} <br />
                <b>Classe:</b> {parsed.summary.classe} <br />
                <b>Nombre élèves:</b> {parsed.summary.nbEleves}
              </Typography>
            </CardContent>
          </Card>

          {/* Controls Continues Table */}
          <Typography variant="h6" gutterBottom>Notes Controls Continues</Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Matière</TableCell>
                  <TableCell>Contrôle 1</TableCell>
                  <TableCell>Contrôle 2</TableCell>
                  <TableCell>Contrôle 3</TableCell>
                  <TableCell>Contrôle 4</TableCell>
                  <TableCell>Activités intégrées</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsed.ccRows.map((row: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell>{row.matiere}</TableCell>
                    {row.notes.map((note: string, j: number) => (
                      <TableCell key={j}>{note}</TableCell>
                    ))}
                    {Array.from({ length: 5 - row.notes.length }).map((_, k) => (
                      <TableCell key={k + row.notes.length}></TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Exam Table */}
          <Typography variant="h6" gutterBottom>Notes Examens</Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Matière</TableCell>
                  <TableCell>Notes CC</TableCell>
                  <TableCell>Coefficient</TableCell>
                  <TableCell>Note Max</TableCell>
                  <TableCell>Note Moyenne Classe</TableCell>
                  <TableCell>Note Min</TableCell>
                  <TableCell>Note Examen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parsed.examRows.map((row: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell>{row.matiere}</TableCell>
                    <TableCell>{row.noteCC}</TableCell>
                    <TableCell>{row.coefficient}</TableCell>
                    <TableCell>{row.noteMax}</TableCell>
                    <TableCell>{row.noteMoyClasse}</TableCell>
                    <TableCell>{row.noteMin}</TableCell>
                    <TableCell>{row.noteExam}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Averages */}
          {(parsed.moyenneSession || parsed.noteExamen) && (
            <Box sx={{ mb: 3 }}>
              {parsed.moyenneSession && (
                <Typography><b>Moyenne session:</b> {parsed.moyenneSession}</Typography>
              )}
              {parsed.noteExamen && (
                <Typography><b>Note examen:</b> {parsed.noteExamen}</Typography>
              )}
            </Box>
          )}

          {/* Chart */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <canvas ref={chartRef} width={400} height={400} style={{ maxWidth: '100%' }} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default GradesTab;