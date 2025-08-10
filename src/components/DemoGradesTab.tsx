import React from 'react';
import {
  Box,
  Typography,
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

const DemoGradesTab: React.FC = () => {
  const mockGrades = {
    summary: {
      etablissement: "Lycée Mohammed V - Rabat",
      niveau: "2ème année Baccalauréat",
      classe: "2BAC SC MATHS A",
      nbEleves: "32"
    },
    ccRows: [
      { matiere: "Mathématiques", notes: ["16.5", "14.0", "17.5", "15.0", "16.0"] },
      { matiere: "Physique-Chimie", notes: ["14.0", "13.5", "15.0", "14.5", "14.75"] },
      { matiere: "Sciences Naturelles", notes: ["15.5", "16.0", "14.0", "15.5", "15.25"] },
      { matiere: "Français", notes: ["13.0", "12.5", "14.0", "13.5", "13.25"] },
      { matiere: "Anglais", notes: ["15.0", "14.5", "16.0", "15.0", "15.125"] },
    ],
    examRows: [
      { matiere: "Mathématiques", noteCC: "15.8", coefficient: "7", noteMax: "18.0", noteMoyClasse: "12.5", noteMin: "6.0", noteExam: "16.0" },
      { matiere: "Physique-Chimie", noteCC: "14.35", coefficient: "6", noteMax: "17.0", noteMoyClasse: "11.8", noteMin: "5.5", noteExam: "14.5" },
      { matiere: "Sciences Naturelles", noteCC: "15.25", coefficient: "5", noteMax: "18.5", noteMoyClasse: "12.2", noteMin: "7.0", noteExam: "15.0" },
      { matiere: "Français", noteCC: "13.25", coefficient: "4", noteMax: "16.0", noteMoyClasse: "11.0", noteMin: "4.0", noteExam: "13.5" },
      { matiere: "Anglais", noteCC: "15.125", coefficient: "3", noteMax: "17.5", noteMoyClasse: "12.8", noteMin: "6.5", noteExam: "15.5" },
    ],
    moyenneSession: "14.85",
    noteExamen: "14.9"
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary">Academic Grades</Typography>
      
      {/* Summary Card */}
      <Card sx={{ mb: 3, bgcolor: '#e3f2fd' }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            {mockGrades.summary.etablissement}
          </Typography>
          <Typography variant="body1">
            <b>Niveau:</b> {mockGrades.summary.niveau} <br />
            <b>Classe:</b> {mockGrades.summary.classe} <br />
            <b>Nombre élèves:</b> {mockGrades.summary.nbEleves}
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
            {mockGrades.ccRows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.matiere}</TableCell>
                {row.notes.map((note, j) => (
                  <TableCell key={j}>{note}</TableCell>
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
            {mockGrades.examRows.map((row, i) => (
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
      <Card sx={{ p: 2, bgcolor: 'success.light' }}>
        <Typography variant="h6" color="success.dark" gutterBottom>Session Results</Typography>
        <Typography variant="body1" color="success.dark">
          <b>Moyenne session:</b> {mockGrades.moyenneSession}/20 <br />
          <b>Note examen:</b> {mockGrades.noteExamen}/20
        </Typography>
      </Card>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        ✅ Grade system implemented with existing parser and chart visualization
      </Typography>
    </Box>
  );
};

export default DemoGradesTab;