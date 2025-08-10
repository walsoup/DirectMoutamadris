import { load } from 'cheerio';
import { StudentInfo, AttendanceData, AttendanceRecord, Schedule, ScheduleItem, Announcement, HomeworkItem } from '../types/moutamadris';

export function parseStudentInfo(html: string): StudentInfo | null {
  try {
    const $ = load(html);
    const studentInfo: StudentInfo = {};

    // Extract student information from various selectors
    $('dl dt, dl dd, .student-info, .info-student').each((_, el) => {
      const text = $(el).text().trim();
      if (text.includes('Nom') || text.includes('Name')) {
        studentInfo.name = $(el).next().text().trim() || $(el).siblings().first().text().trim();
      }
      if (text.includes('Code Massar') || text.includes('Massar Code')) {
        studentInfo.massarCode = $(el).next().text().trim() || $(el).siblings().first().text().trim();
      }
      if (text.includes('Etablissement') || text.includes('Establishment')) {
        studentInfo.establishment = $(el).next().text().trim() || $(el).siblings().first().text().trim();
      }
      if (text.includes('Niveau') || text.includes('Level')) {
        studentInfo.level = $(el).next().text().trim() || $(el).siblings().first().text().trim();
      }
      if (text.includes('Classe') || text.includes('Class')) {
        studentInfo.class = $(el).next().text().trim() || $(el).siblings().first().text().trim();
      }
    });

    return studentInfo;
  } catch (error) {
    console.error('Error parsing student info:', error);
    return null;
  }
}

export function parseAttendance(html: string): AttendanceData | null {
  try {
    const $ = load(html);
    const attendanceData: AttendanceData = {
      records: []
    };

    // Parse attendance table
    $('table tbody tr').each((_, tr) => {
      const tds = $(tr).find('td');
      if (tds.length >= 3) {
        const record: AttendanceRecord = {
          date: $(tds[0]).text().trim(),
          subject: $(tds[1]).text().trim(),
          type: $(tds[2]).text().trim(),
          justified: $(tds[3]).text().trim().toLowerCase().includes('oui') || $(tds[3]).text().trim().toLowerCase().includes('yes'),
          reason: tds.length > 4 ? $(tds[4]).text().trim() : undefined
        };
        attendanceData.records?.push(record);
      }
    });

    // Parse summary statistics
    $('.absence-summary, .summary').each((_, el) => {
      const text = $(el).text();
      const totalMatch = text.match(/Total[:\s]*(\d+)/i);
      if (totalMatch) attendanceData.totalAbsences = parseInt(totalMatch[1]);
      
      const justifiedMatch = text.match(/Justifi[éê]es?[:\s]*(\d+)/i);
      if (justifiedMatch) attendanceData.justifiedAbsences = parseInt(justifiedMatch[1]);
      
      const unjustifiedMatch = text.match(/Non[- ]justifi[éê]es?[:\s]*(\d+)/i);
      if (unjustifiedMatch) attendanceData.unjustifiedAbsences = parseInt(unjustifiedMatch[1]);
    });

    return attendanceData;
  } catch (error) {
    console.error('Error parsing attendance:', error);
    return null;
  }
}

export function parseSchedule(html: string): Schedule | null {
  try {
    const $ = load(html);
    const schedule: Schedule = {
      items: []
    };

    // Parse schedule table
    $('table tbody tr, .schedule-item, .emploi-item').each((_, tr) => {
      const tds = $(tr).find('td');
      if (tds.length >= 4) {
        const item: ScheduleItem = {
          time: $(tds[0]).text().trim(),
          subject: $(tds[1]).text().trim(),
          teacher: $(tds[2]).text().trim(),
          room: $(tds[3]).text().trim(),
          day: tds.length > 4 ? $(tds[4]).text().trim() : undefined
        };
        schedule.items?.push(item);
      }
    });

    return schedule;
  } catch (error) {
    console.error('Error parsing schedule:', error);
    return null;
  }
}

export function parseAnnouncements(html: string): Announcement[] {
  try {
    const $ = load(html);
    const announcements: Announcement[] = [];

    $('.announcement, .annonce, .news-item').each((_, el) => {
      const announcement: Announcement = {
        title: $(el).find('.title, .titre, h3, h4').first().text().trim(),
        content: $(el).find('.content, .contenu, .description, p').first().text().trim(),
        date: $(el).find('.date, .date-creation').first().text().trim(),
        author: $(el).find('.author, .auteur').first().text().trim()
      };
      
      if (announcement.title || announcement.content) {
        announcements.push(announcement);
      }
    });

    // Fallback: try to parse from table format
    if (announcements.length === 0) {
      $('table tbody tr').each((_, tr) => {
        const tds = $(tr).find('td');
        if (tds.length >= 2) {
          announcements.push({
            date: $(tds[0]).text().trim(),
            title: $(tds[1]).text().trim(),
            content: tds.length > 2 ? $(tds[2]).text().trim() : undefined,
            author: tds.length > 3 ? $(tds[3]).text().trim() : undefined
          });
        }
      });
    }

    return announcements;
  } catch (error) {
    console.error('Error parsing announcements:', error);
    return [];
  }
}

export function parseHomework(html: string): HomeworkItem[] {
  try {
    const $ = load(html);
    const homework: HomeworkItem[] = [];

    $('.homework, .devoir, .assignment').each((_, el) => {
      const item: HomeworkItem = {
        subject: $(el).find('.subject, .matiere').first().text().trim(),
        title: $(el).find('.title, .titre, h3, h4').first().text().trim(),
        description: $(el).find('.description, .contenu, p').first().text().trim(),
        dueDate: $(el).find('.due-date, .date-echeance').first().text().trim(),
        assignedDate: $(el).find('.assigned-date, .date-creation').first().text().trim()
      };
      
      if (item.title || item.description) {
        homework.push(item);
      }
    });

    // Fallback: try to parse from table format
    if (homework.length === 0) {
      $('table tbody tr').each((_, tr) => {
        const tds = $(tr).find('td');
        if (tds.length >= 3) {
          homework.push({
            subject: $(tds[0]).text().trim(),
            title: $(tds[1]).text().trim(),
            description: $(tds[2]).text().trim(),
            dueDate: tds.length > 3 ? $(tds[3]).text().trim() : undefined,
            assignedDate: tds.length > 4 ? $(tds[4]).text().trim() : undefined
          });
        }
      });
    }

    return homework;
  } catch (error) {
    console.error('Error parsing homework:', error);
    return [];
  }
}