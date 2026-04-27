'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================================
// SchoolPlanner — Full React Client Component
// Preserves all original vanilla JS functionality
// ============================================================

// --- SVG Icons (inline, no dependencies) ---
const icons = {
  home: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  calendar: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  book: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  clipboard: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>,
  fileText: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
  barChart: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>,
  bell: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  check: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  chevronDown: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  chevronLeft: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  chevronRight: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  plus: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>,
  clock: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  x: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  listChecks: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>,
  graduationCap: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>,
  sun: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
  moon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  timer: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="12" y1="2" y2="6"/><circle cx="12" cy="14" r="8"/><polyline points="12 10 12 14 14 14"/></svg>,
  notepad: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M12 2v4"/><path d="M16 2v4"/><rect x="4" y="4" width="16" height="18" rx="2"/><path d="M8 10h8"/><path d="M8 14h6"/></svg>,
};

function Icon({ name, size = 18 }) {
  return <span style={{ display: 'inline-flex', width: size, height: size }}>{icons[name]}</span>;
}

// --- Data ---
const subjects = {
  wiskunde: { name: 'Wiskunde', color: '#3B82F6', light: '#DBEAFE', teacher: 'Dhr. Bakker', icon: '📐' },
  nederlands: { name: 'Nederlands', color: '#EF4444', light: '#FEE2E2', teacher: 'Mevr. Jansen', icon: '📖' },
  engels: { name: 'Engels', color: '#8B5CF6', light: '#EDE9FE', teacher: 'Dhr. Williams', icon: '🇬🇧' },
  natuurkunde: { name: 'Natuurkunde', color: '#F59E0B', light: '#FEF3C7', teacher: 'Mevr. de Boer', icon: '⚡' },
  geschiedenis: { name: 'Geschiedenis', color: '#10B981', light: '#D1FAE5', teacher: 'Dhr. Vermeer', icon: '🏛️' },
  biologie: { name: 'Biologie', color: '#06B6D4', light: '#CFFAFE', teacher: 'Mevr. Smit', icon: '🧬' },
  scheikunde: { name: 'Scheikunde', color: '#EC4899', light: '#FCE7F3', teacher: 'Dhr. van Dijk', icon: '🧪' },
  economie: { name: 'Economie', color: '#F97316', light: '#FFEDD5', teacher: 'Mevr. de Groot', icon: '📊' },
};

const vakColorPalette = ['#3B82F6','#EF4444','#8B5CF6','#F59E0B','#10B981','#06B6D4','#EC4899','#F97316','#6366F1','#14B8A6','#E11D48','#7C3AED','#0EA5E9','#D97706','#059669','#DC2626','#8B5CF6','#2563EB'];
function getVakColor(vakName, index) {
  const key = vakName.toLowerCase().replace(/[^a-z]/g, '');
  const s = subjects[key];
  if (s) return s.color;
  return vakColorPalette[index % vakColorPalette.length];
}

const dayNames = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag'];
const dayLabels = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];
const eventTypeColors = {
  school: { bg: '#DBEAFE', text: '#1E40AF', label: 'School' },
  deadline: { bg: '#FEE2E2', text: '#991B1B', label: 'Deadline' },
  toets: { bg: '#FEF3C7', text: '#92400E', label: 'Toets' },
  les: { bg: '#D1FAE5', text: '#065F46', label: 'Les' },
  ics: { bg: '#E0E7FF', text: '#3730A3', label: 'Kalender' },
};
// --- Exam schedule 2026 (source: examenblad.nl) ---
const niveaus = ['VMBO GL/TL', 'HAVO', 'VWO'];
const examVakkenPerNiveau = {
  'VMBO GL/TL': ['Nederlands','Engels','Wiskunde','Frans','Duits','Geschiedenis','Aardrijkskunde','Biologie','Natuurkunde (Nask 1)','Scheikunde (Nask 2)','Economie','Maatschappijleer','Beeldende vorming','Muziek','Dans','Drama','Fries'],
  'HAVO': ['Nederlands','Engels','Frans','Duits','Wiskunde A','Wiskunde B','Geschiedenis','Aardrijkskunde','Economie','Bedrijfseconomie','Biologie','Natuurkunde','Scheikunde','Maatschappijwetenschappen','Filosofie','Kunst (algemeen)','Muziek','Tekenen/Textiel'],
  'VWO': ['Nederlands','Engels','Frans','Duits','Wiskunde A','Wiskunde B','Wiskunde C','Geschiedenis','Aardrijkskunde','Economie','Bedrijfseconomie','Biologie','Natuurkunde','Scheikunde','Maatschappijwetenschappen','Filosofie','Kunst (algemeen)','Latijn','Grieks','Muziek','Tekenen/Textiel','Natuurwetenschappen'],
};
const examenRooster2026 = [
  // Eerste tijdvak
  { date: '2026-05-08', time: '09:00-12:00', subject: 'Filosofie', levels: ['HAVO'] },
  { date: '2026-05-08', time: '09:00-12:00', subject: 'Kunst (algemeen)', levels: ['VWO'] },
  { date: '2026-05-08', time: '13:30-15:30', subject: 'Wiskunde', levels: ['VMBO GL/TL'] },
  { date: '2026-05-08', time: '13:30-16:30', subject: 'Bedrijfseconomie', levels: ['VWO'] },
  { date: '2026-05-08', time: '13:30-16:30', subject: 'Nederlands', levels: ['HAVO'] },
  { date: '2026-05-08', time: '13:30-16:30', subject: 'Natuurwetenschappen', levels: ['VWO'] },
  { date: '2026-05-11', time: '09:00-11:00', subject: 'Muziek', levels: ['VMBO GL/TL'] },
  { date: '2026-05-11', time: '09:00-12:00', subject: 'Geschiedenis', levels: ['VWO'] },
  { date: '2026-05-11', time: '09:00-12:00', subject: 'Kunst (algemeen)', levels: ['HAVO'] },
  { date: '2026-05-11', time: '13:30-15:30', subject: 'Nederlands', levels: ['VMBO GL/TL'] },
  { date: '2026-05-11', time: '13:30-16:30', subject: 'Economie', levels: ['HAVO'] },
  { date: '2026-05-11', time: '13:30-16:30', subject: 'Natuurkunde', levels: ['VWO'] },
  { date: '2026-05-12', time: '09:00-11:00', subject: 'Aardrijkskunde', levels: ['VMBO GL/TL'] },
  { date: '2026-05-12', time: '09:00-11:30', subject: 'Tekenen/Textiel', levels: ['VWO'] },
  { date: '2026-05-12', time: '09:00-12:00', subject: 'Geschiedenis', levels: ['HAVO'] },
  { date: '2026-05-12', time: '13:30-15:30', subject: 'Frans', levels: ['VMBO GL/TL'] },
  { date: '2026-05-12', time: '13:30-16:30', subject: 'Nederlands', levels: ['VWO'] },
  { date: '2026-05-12', time: '13:30-16:30', subject: 'Scheikunde', levels: ['HAVO'] },
  { date: '2026-05-13', time: '09:00-11:00', subject: 'Beeldende vorming', levels: ['VMBO GL/TL'] },
  { date: '2026-05-13', time: '09:00-12:00', subject: 'Filosofie', levels: ['VWO'] },
  { date: '2026-05-13', time: '13:30-15:30', subject: 'Economie', levels: ['VMBO GL/TL'] },
  { date: '2026-05-13', time: '13:30-16:00', subject: 'Frans', levels: ['HAVO'] },
  { date: '2026-05-13', time: '13:30-16:30', subject: 'Wiskunde A', levels: ['VWO'] },
  { date: '2026-05-13', time: '13:30-16:30', subject: 'Wiskunde B', levels: ['VWO'] },
  { date: '2026-05-13', time: '13:30-16:30', subject: 'Wiskunde C', levels: ['VWO'] },
  { date: '2026-05-18', time: '09:00-11:00', subject: 'Duits', levels: ['VMBO GL/TL'] },
  { date: '2026-05-18', time: '09:00-11:30', subject: 'Duits', levels: ['VWO'] },
  { date: '2026-05-18', time: '09:00-12:00', subject: 'Maatschappijwetenschappen', levels: ['HAVO'] },
  { date: '2026-05-18', time: '13:30-15:30', subject: 'Natuurkunde (Nask 1)', levels: ['VMBO GL/TL'] },
  { date: '2026-05-18', time: '13:30-16:00', subject: 'Engels', levels: ['HAVO'] },
  { date: '2026-05-18', time: '13:30-16:30', subject: 'Aardrijkskunde', levels: ['VWO'] },
  { date: '2026-05-19', time: '09:00-11:00', subject: 'Maatschappijleer', levels: ['VMBO GL/TL'] },
  { date: '2026-05-19', time: '09:00-11:30', subject: 'Muziek', levels: ['HAVO'] },
  { date: '2026-05-19', time: '09:00-12:00', subject: 'Latijn', levels: ['VWO'] },
  { date: '2026-05-19', time: '13:30-15:30', subject: 'Engels', levels: ['VMBO GL/TL'] },
  { date: '2026-05-19', time: '13:30-16:30', subject: 'Scheikunde', levels: ['VWO'] },
  { date: '2026-05-19', time: '13:30-16:30', subject: 'Wiskunde A', levels: ['HAVO'] },
  { date: '2026-05-19', time: '13:30-16:30', subject: 'Wiskunde B', levels: ['HAVO'] },
  { date: '2026-05-20', time: '09:00-11:00', subject: 'Dans', levels: ['VMBO GL/TL'] },
  { date: '2026-05-20', time: '09:00-11:00', subject: 'Drama', levels: ['VMBO GL/TL'] },
  { date: '2026-05-20', time: '09:00-11:30', subject: 'Duits', levels: ['HAVO'] },
  { date: '2026-05-20', time: '09:00-12:00', subject: 'Maatschappijwetenschappen', levels: ['VWO'] },
  { date: '2026-05-20', time: '13:30-15:30', subject: 'Biologie', levels: ['VMBO GL/TL'] },
  { date: '2026-05-20', time: '13:30-16:00', subject: 'Engels', levels: ['VWO'] },
  { date: '2026-05-20', time: '13:30-16:30', subject: 'Biologie', levels: ['HAVO'] },
  { date: '2026-05-21', time: '09:00-11:30', subject: 'Muziek', levels: ['VWO'] },
  { date: '2026-05-21', time: '09:00-11:30', subject: 'Tekenen/Textiel', levels: ['HAVO'] },
  { date: '2026-05-21', time: '13:30-15:30', subject: 'Scheikunde (Nask 2)', levels: ['VMBO GL/TL'] },
  { date: '2026-05-21', time: '13:30-16:30', subject: 'Aardrijkskunde', levels: ['HAVO'] },
  { date: '2026-05-21', time: '13:30-16:30', subject: 'Economie', levels: ['VWO'] },
  { date: '2026-05-22', time: '09:00-11:00', subject: 'Fries', levels: ['VMBO GL/TL'] },
  { date: '2026-05-22', time: '09:00-12:00', subject: 'Grieks', levels: ['VWO'] },
  { date: '2026-05-22', time: '13:30-15:30', subject: 'Geschiedenis', levels: ['VMBO GL/TL'] },
  { date: '2026-05-22', time: '13:30-16:30', subject: 'Bedrijfseconomie', levels: ['HAVO'] },
  { date: '2026-05-22', time: '13:30-16:30', subject: 'Biologie', levels: ['VWO'] },
  { date: '2026-05-26', time: '13:30-16:00', subject: 'Frans', levels: ['VWO'] },
  { date: '2026-05-26', time: '13:30-16:30', subject: 'Natuurkunde', levels: ['HAVO'] },
  { date: '2026-05-27', time: '09:00-11:30', subject: 'Fries', levels: ['HAVO','VWO'] },
  // Tweede tijdvak
  { date: '2026-06-16', time: '13:30-15:30', subject: 'Beeldende vorming', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-16', time: '13:30-15:30', subject: 'Natuurkunde (Nask 1)', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-16', time: '13:30-16:00', subject: 'Frans', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-16', time: '13:30-16:30', subject: 'Natuurkunde', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-16', time: '13:30-16:30', subject: 'Scheikunde', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-17', time: '13:30-15:30', subject: 'Geschiedenis', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-17', time: '13:30-15:30', subject: 'Maatschappijleer', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-17', time: '13:30-16:30', subject: 'Economie', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-17', time: '13:30-16:30', subject: 'Nederlands', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-17', time: '13:30-16:30', subject: 'Wiskunde A', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-17', time: '13:30-16:30', subject: 'Wiskunde C', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-18', time: '09:00-11:00', subject: 'Dans', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-18', time: '09:00-11:00', subject: 'Drama', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-18', time: '09:00-11:00', subject: 'Fries', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-18', time: '09:00-11:00', subject: 'Muziek', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-18', time: '09:00-11:30', subject: 'Fries', levels: ['VWO'], tijdvak: 2 },
  { date: '2026-06-18', time: '13:30-15:30', subject: 'Aardrijkskunde', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-18', time: '13:30-15:30', subject: 'Biologie', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-18', time: '13:30-16:30', subject: 'Aardrijkskunde', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-18', time: '13:30-16:30', subject: 'Geschiedenis', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-18', time: '13:30-16:30', subject: 'Wiskunde B', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-19', time: '09:00-12:00', subject: 'Grieks', levels: ['VWO'], tijdvak: 2 },
  { date: '2026-06-19', time: '13:30-15:30', subject: 'Scheikunde (Nask 2)', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-19', time: '13:30-16:30', subject: 'Filosofie', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-19', time: '13:30-16:30', subject: 'Kunst (algemeen)', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-22', time: '13:30-15:30', subject: 'Duits', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-22', time: '13:30-15:30', subject: 'Frans', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-22', time: '13:30-15:30', subject: 'Nederlands', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-22', time: '13:30-16:00', subject: 'Engels', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-22', time: '13:30-16:30', subject: 'Bedrijfseconomie', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-22', time: '13:30-16:30', subject: 'Latijn', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-23', time: '13:30-15:30', subject: 'Economie', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-23', time: '13:30-15:30', subject: 'Engels', levels: ['VMBO GL/TL'], tijdvak: 2 },
  { date: '2026-06-23', time: '13:30-16:00', subject: 'Duits', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-23', time: '13:30-16:30', subject: 'Biologie', levels: ['HAVO','VWO'], tijdvak: 2 },
  { date: '2026-06-23', time: '13:30-16:30', subject: 'Maatschappijwetenschappen', levels: ['HAVO','VWO'], tijdvak: 2 },
];

const calendarApps = {
  google: { name: 'Google Calendar', icon: '🟢', color: '#1A73E8', lightBg: '#E8F0FE' },
  apple: { name: 'Apple Kalender', icon: '🍎', color: '#333333', lightBg: '#F5F5F5' },
  outlook: { name: 'Outlook Kalender', icon: '📧', color: '#0078D4', lightBg: '#E1F0FF' },
  ical: { name: 'iCal / CalDAV', icon: '📅', color: '#5856D6', lightBg: '#EEEDFC' },
};

const defaultSchedule = {
  maandag: [
    { hour: 1, time: '08:30 - 09:20', subject: 'wiskunde', room: 'A204' },
    { hour: 2, time: '09:20 - 10:10', subject: 'nederlands', room: 'B112' },
    { hour: 3, time: '10:30 - 11:20', subject: 'engels', room: 'C301' },
    { hour: 4, time: '11:20 - 12:10', subject: 'natuurkunde', room: 'D105' },
    { hour: 6, time: '12:40 - 13:30', subject: 'geschiedenis', room: 'A108' },
  ],
  dinsdag: [
    { hour: 1, time: '08:30 - 09:20', subject: 'biologie', room: 'D201' },
    { hour: 2, time: '09:20 - 10:10', subject: 'scheikunde', room: 'D105' },
    { hour: 3, time: '10:30 - 11:20', subject: 'wiskunde', room: 'A204' },
    { hour: 4, time: '11:20 - 12:10', subject: 'economie', room: 'B205' },
    { hour: 5, time: '12:10 - 13:00', subject: 'nederlands', room: 'B112' },
  ],
  woensdag: [
    { hour: 1, time: '08:30 - 09:20', subject: 'engels', room: 'C301' },
    { hour: 2, time: '09:20 - 10:10', subject: 'natuurkunde', room: 'D105' },
    { hour: 3, time: '10:30 - 11:20', subject: 'geschiedenis', room: 'A108' },
    { hour: 4, time: '11:20 - 12:10', subject: 'biologie', room: 'D201' },
  ],
  donderdag: [
    { hour: 1, time: '08:30 - 09:20', subject: 'scheikunde', room: 'D105' },
    { hour: 2, time: '09:20 - 10:10', subject: 'economie', room: 'B205' },
    { hour: 3, time: '10:30 - 11:20', subject: 'wiskunde', room: 'A204' },
    { hour: 5, time: '12:10 - 13:00', subject: 'engels', room: 'C301' },
    { hour: 6, time: '12:40 - 13:30', subject: 'nederlands', room: 'B112' },
    { hour: 7, time: '13:30 - 14:20', subject: 'natuurkunde', room: 'D105' },
  ],
  vrijdag: [
    { hour: 1, time: '08:30 - 09:20', subject: 'geschiedenis', room: 'A108' },
    { hour: 2, time: '09:20 - 10:10', subject: 'biologie', room: 'D201' },
    { hour: 3, time: '10:30 - 11:20', subject: 'economie', room: 'B205' },
    { hour: 4, time: '11:20 - 12:10', subject: 'scheikunde', room: 'D105' },
  ],
};

const defaultGrades = {
  wiskunde: { grades: [
    { value: 7.2, description: 'Toets H1', weight: 1, date: '2026-02-10' },
    { value: 6.8, description: 'SO H2', weight: 0.5, date: '2026-02-24' },
    { value: 8.1, description: 'Proefwerk H3', weight: 2, date: '2026-03-10' },
    { value: 7.5, description: 'Toets H4', weight: 1, date: '2026-03-20' },
    { value: 6.9, description: 'SO H5', weight: 0.5, date: '2026-03-28' },
  ]},
  nederlands: { grades: [
    { value: 6.5, description: 'Opstel', weight: 1, date: '2026-02-12' },
    { value: 7.8, description: 'Grammatica', weight: 1, date: '2026-02-28' },
    { value: 7.0, description: 'Boekverslag', weight: 2, date: '2026-03-14' },
    { value: 8.2, description: 'Spreekbeurt', weight: 1, date: '2026-03-25' },
  ]},
  engels: { grades: [
    { value: 8.0, description: 'Vocab T1', weight: 0.5, date: '2026-02-08' },
    { value: 7.5, description: 'Writing', weight: 1, date: '2026-02-20' },
    { value: 8.8, description: 'Vocab T2', weight: 0.5, date: '2026-03-05' },
    { value: 7.2, description: 'Reading', weight: 1, date: '2026-03-18' },
    { value: 9.1, description: 'Speaking', weight: 2, date: '2026-03-30' },
  ]},
  natuurkunde: { grades: [
    { value: 6.2, description: 'Toets H1', weight: 1, date: '2026-02-15' },
    { value: 5.8, description: 'Practicum', weight: 0.5, date: '2026-02-26' },
    { value: 7.4, description: 'Proefwerk H2-3', weight: 2, date: '2026-03-12' },
    { value: 6.9, description: 'SO H4', weight: 0.5, date: '2026-03-26' },
  ]},
  geschiedenis: { grades: [
    { value: 7.8, description: 'Toets WO2', weight: 1, date: '2026-02-18' },
    { value: 8.5, description: 'Werkstuk', weight: 2, date: '2026-03-08' },
    { value: 6.7, description: 'SO Koude Oorlog', weight: 0.5, date: '2026-03-22' },
  ]},
  biologie: { grades: [
    { value: 7.1, description: 'Toets Cel', weight: 1, date: '2026-02-14' },
    { value: 6.4, description: 'Practicum', weight: 0.5, date: '2026-02-27' },
    { value: 8.0, description: 'Proefwerk Ecologie', weight: 2, date: '2026-03-11' },
    { value: 7.3, description: 'SO Evolutie', weight: 0.5, date: '2026-03-24' },
  ]},
  scheikunde: { grades: [
    { value: 5.9, description: 'Toets Atoom', weight: 1, date: '2026-02-16' },
    { value: 6.3, description: 'SO Reacties', weight: 0.5, date: '2026-03-02' },
    { value: 7.1, description: 'Proefwerk H3', weight: 2, date: '2026-03-15' },
    { value: 6.0, description: 'Practicum', weight: 0.5, date: '2026-03-27' },
  ]},
  economie: { grades: [
    { value: 7.5, description: 'Toets Markt', weight: 1, date: '2026-02-20' },
    { value: 8.0, description: 'Werkstuk', weight: 2, date: '2026-03-06' },
    { value: 7.8, description: 'SO Conjunctuur', weight: 0.5, date: '2026-03-19' },
  ]},
};

const defaultSettings = {
  lessonDuration: 50, startTime: '08:30', breakAfter: 2, breakDuration: 20,
  lunchAfter: 4, lunchDuration: 30, break2Enabled: false, break2After: 6, break2Duration: 15, maxLessons: 8, schoolName: 'Het Nieuwe Lyceum',
  userName: 'Emma de Vries', userEmail: 'emma@leerling.nl', userClass: '4 VWO',
  theme: 'light', notifications: true, weekendHidden: true,
  dayOverrides: {},
  niveau: '', examVakken: [],
  mijnVakken: [],
  schoolVakken: [], // vakken voor huiswerk/toetsen/cijfers
  pomodoroWork: 25, pomodoroBreak: 5, pomodoroLongBreak: 15, pomodoroRounds: 4,
  hiddenPages: [],
};

// --- Helpers ---
function daysFromNow(n) { const d = new Date(); d.setDate(d.getDate() + n); return d; }
function formatDate(date) {
  const days = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];
  const months = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}
function formatDateShort(date) { return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`; }
function getGreeting() { const h = new Date().getHours(); return h < 12 ? 'Goedemorgen' : h < 18 ? 'Goedemiddag' : 'Goedenavond'; }
function getAverage(arr) {
  if (!arr || arr.length === 0) return '0.0';
  if (typeof arr[0] === 'object') {
    const totalWeight = arr.reduce((s, g) => s + (g.weight || 1), 0);
    if (totalWeight === 0) return '0.0';
    return (arr.reduce((s, g) => s + (g.value || 0) * (g.weight || 1), 0) / totalWeight).toFixed(1);
  }
  return (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1);
}
function getDueText(date) {
  const now = new Date(); const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((dueStart - todayStart) / 86400000);
  if (diff < 0) return { text: `${Math.abs(diff)} dagen geleden`, urgent: true };
  if (diff === 0) return { text: 'Vandaag', urgent: true };
  if (diff === 1) return { text: 'Morgen', urgent: true };
  if (diff <= 3) return { text: `Over ${diff} dagen`, urgent: false };
  return { text: formatDateShort(date), urgent: false };
}
function dateToInputStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function initHomework() {
  return [
    { id: 1, subject: 'wiskunde', title: 'Hoofdstuk 5 opgaven 1-15', due: daysFromNow(0), done: false },
    { id: 2, subject: 'nederlands', title: 'Boekverslag "Turks Fruit"', due: daysFromNow(0), done: false },
    { id: 3, subject: 'engels', title: 'Vocabulary Unit 8 leren', due: daysFromNow(1), done: false },
    { id: 4, subject: 'natuurkunde', title: 'Practicum verslag schrijven', due: daysFromNow(1), done: true },
    { id: 5, subject: 'geschiedenis', title: 'Samenvatting Koude Oorlog', due: daysFromNow(2), done: false },
    { id: 6, subject: 'biologie', title: 'Paragraaf 3.4 en 3.5 bestuderen', due: daysFromNow(3), done: false },
    { id: 7, subject: 'scheikunde', title: 'Opgaven mol berekeningen', due: daysFromNow(3), done: true },
    { id: 8, subject: 'economie', title: 'Artikel analyse schrijven', due: daysFromNow(5), done: false },
    { id: 9, subject: 'wiskunde', title: 'Oefentoets algebra', due: daysFromNow(6), done: false },
    { id: 10, subject: 'engels', title: 'Essay "Climate Change" (500 words)', due: daysFromNow(7), done: false },
  ];
}

function initTests() {
  return [
    { id: 1, subject: 'wiskunde', title: 'Toets Hoofdstuk 5 — Algebra', date: daysFromNow(2), chapter: 'H5' },
    { id: 2, subject: 'natuurkunde', title: 'Proefwerk Krachten & Beweging', date: daysFromNow(4), chapter: 'H3-4' },
    { id: 3, subject: 'engels', title: 'Vocabulary Test Unit 7-8', date: daysFromNow(5), chapter: 'U7-8' },
    { id: 4, subject: 'geschiedenis', title: 'SO Koude Oorlog', date: daysFromNow(7), chapter: 'H6' },
    { id: 5, subject: 'scheikunde', title: 'Proefwerk Mol berekeningen', date: daysFromNow(9), chapter: 'H4' },
    { id: 6, subject: 'biologie', title: 'Toets Evolutie', date: daysFromNow(12), chapter: 'H7' },
    { id: 7, subject: 'economie', title: 'Proefwerk Marktvormen', date: daysFromNow(14), chapter: 'H5-6' },
    { id: 8, subject: 'nederlands', title: 'Literatuurtoets Periode 3', date: daysFromNow(18), chapter: 'Lit.' },
  ];
}

function initEvents() {
  return [
    { id: 1, date: daysFromNow(-1), title: 'Ouderavond', time: '19:00 - 21:00', type: 'school' },
    { id: 2, date: daysFromNow(0), title: 'Inleveren boekverslag', time: '23:59', type: 'deadline' },
    { id: 3, date: daysFromNow(0), title: 'Wiskundebijles', time: '15:30 - 16:30', type: 'les' },
    { id: 4, date: daysFromNow(1), title: 'Sportdag', time: '09:00 - 15:00', type: 'school' },
    { id: 5, date: daysFromNow(2), title: 'Toets Wiskunde H5', time: '10:30', type: 'toets' },
    { id: 6, date: daysFromNow(3), title: 'Excursie Rijksmuseum', time: '08:30 - 14:00', type: 'school' },
    { id: 7, date: daysFromNow(4), title: 'Proefwerk Natuurkunde', time: '11:20', type: 'toets' },
    { id: 8, date: daysFromNow(5), title: 'Mentoruur', time: '12:10 - 13:00', type: 'school' },
    { id: 9, date: daysFromNow(6), title: 'Deadline essay Engels', time: '23:59', type: 'deadline' },
    { id: 10, date: daysFromNow(7), title: 'SO Geschiedenis', time: '08:30', type: 'toets' },
    { id: 11, date: daysFromNow(10), title: 'Voorjaarsvakantie begint', time: 'Hele dag', type: 'school' },
    { id: 12, date: daysFromNow(14), title: 'Proefwerk Economie', time: '09:20', type: 'toets' },
    { id: 13, date: daysFromNow(21), title: 'Rapportvergadering', time: '14:00 - 16:00', type: 'school' },
    { id: 14, date: daysFromNow(28), title: 'Open dag school', time: '10:00 - 14:00', type: 'school' },
  ];
}

function initTodos() {
  return [
    { id: 1, text: 'Wiskunde opgaven maken', done: false },
    { id: 2, text: 'Boekverslag afmaken', done: true },
    { id: 3, text: 'Engels woordjes oefenen', done: false },
    { id: 4, text: 'Scheikunde samenvatting', done: false },
    { id: 5, text: 'Geschiedenis leren H6', done: false },
  ];
}

// --- Circular Progress ---
function CircularProgress({ percentage, size = 140, strokeWidth = 10, hideLabel = false }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--gray-100)" strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--accent)" strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}/>
      </svg>
      <div className="progress-text">
        <div className="progress-percentage">{percentage}%</div>
        {!hideLabel && <div className="progress-label">voltooid</div>}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function SchoolPlanner() {
  const today = useRef(new Date()).current;

  // --- State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [schedule, setSchedule] = useState(JSON.parse(JSON.stringify(defaultSchedule)));
  const [homework, setHomework] = useState(initHomework);
  const [tests, setTests] = useState(initTests);
  const [events, setEvents] = useState(initEvents);
  const [todos, setTodos] = useState(initTodos);
  const [grades, setGrades] = useState(defaultGrades);
  const [settings, setSettings] = useState(defaultSettings);
  const [magistarConnected, setMagistarConnected] = useState(false);
  const [magistarAccount, setMagistarAccount] = useState({});
  const [calendarConnections, setCalendarConnections] = useState({});
  const [calendarAccounts, setCalendarAccounts] = useState({});
  const [modal, setModal] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hwFilter, setHwFilter] = useState('alles');
  const [miniCalYear, setMiniCalYear] = useState(today.getFullYear());
  const [miniCalMonth, setMiniCalMonth] = useState(today.getMonth());
  const [agendaYear, setAgendaYear] = useState(today.getFullYear());
  const [agendaMonth, setAgendaMonth] = useState(today.getMonth());
  const [agendaSelectedDate, setAgendaSelectedDate] = useState(today);
  const [openGrades, setOpenGrades] = useState({});
  const [activeDayTab, setActiveDayTab] = useState(() => {
    const d = today.getDay(); return (d >= 1 && d <= 5) ? d - 1 : 0;
  });
  const [newTodoText, setNewTodoText] = useState('');
  const [magistarLoading, setMagistarLoading] = useState(false);
  const [magistarError, setMagistarError] = useState('');
  const [icsUrls, setIcsUrls] = useState({});
  const [icsLoading, setIcsLoading] = useState(false);
  const [icsError, setIcsError] = useState('');
  const [magisterIcsUrl, setMagisterIcsUrl] = useState('');
  const [magisterIcsLoading, setMagisterIcsLoading] = useState(false);
  const [magisterIcsError, setMagisterIcsError] = useState('');
  const [magisterIcsLastSync, setMagisterIcsLastSync] = useState('');
  const [wizardDay, setWizardDay] = useState(0);
  const [wizardSchedule, setWizardSchedule] = useState({ maandag: [], dinsdag: [], woensdag: [], donderdag: [], vrijdag: [] });
  const [darkMode, setDarkMode] = useState(false);
  // Pomodoro
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroPhase, setPomodoroPhase] = useState('work'); // 'work', 'break', 'longBreak'
  const [pomodoroRound, setPomodoroRound] = useState(1);
  const [pomodorosToday, setPomodorosToday] = useState(0);
  const [pomodoroMinutesToday, setPomodoroMinutesToday] = useState(0);
  const pomodoroRef = useRef(null);
  // Notes
  const [notes, setNotes] = useState({});
  const [editingNote, setEditingNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [settingsDayTab, setSettingsDayTab] = useState('standaard');
  const [cijfersView, setCijfersView] = useState('overzicht'); // 'overzicht', 'jaaroverzicht', or a subject key
  const [examSetupDone, setExamSetupDone] = useState(false);
  const [notitiesSetupDone, setNotitiesSetupDone] = useState(false);
  const [nieuwVakNaam, setNieuwVakNaam] = useState('');
  const [timerAlert, setTimerAlert] = useState(null); // { message, type: 'work'|'break' }


  // --- Load from localStorage on mount ---
  useEffect(() => {
    const li = localStorage.getItem('sp_logged_in');
    if (li === 'true') setIsLoggedIn(true);
    const savedSched = localStorage.getItem('sp_schedule');
    if (savedSched) try { setSchedule(JSON.parse(savedSched)); } catch(e) {}
    const savedHw = localStorage.getItem('sp_homework');
    if (savedHw) try {
      const parsed = JSON.parse(savedHw);
      parsed.forEach(h => { h.due = new Date(h.due); });
      setHomework(prev => {
        const merged = [...prev];
        merged.forEach(hw => { const s = parsed.find(p => p.id === hw.id); if (s) hw.done = s.done; });
        parsed.filter(p => p.id > 100).forEach(item => { item.due = new Date(item.due); merged.push(item); });
        return merged;
      });
    } catch(e) {}
    const savedTests = localStorage.getItem('sp_tests');
    if (savedTests) try { const p = JSON.parse(savedTests); p.forEach(t => { t.date = new Date(t.date); }); setTests(p); } catch(e) {}
    const savedEvents = localStorage.getItem('sp_events');
    if (savedEvents) try { const p = JSON.parse(savedEvents); p.forEach(e => { e.date = new Date(e.date); }); setEvents(p); } catch(e) {}
    const savedTodos = localStorage.getItem('sp_todos');
    if (savedTodos) try { setTodos(JSON.parse(savedTodos)); } catch(e) {}
    const savedGrades = localStorage.getItem('sp_grades');
    if (savedGrades) try { setGrades(JSON.parse(savedGrades)); } catch(e) {}
    const savedSettings = localStorage.getItem('sp_settings');
    if (savedSettings) try { setSettings(s => ({...s, ...JSON.parse(savedSettings)})); } catch(e) {}
    const mc = localStorage.getItem('sp_magister_connected');
    if (mc === 'true') setMagistarConnected(true);
    const ma = localStorage.getItem('sp_magister_account');
    if (ma) try { setMagistarAccount(JSON.parse(ma)); } catch(e) {}
    const cc = localStorage.getItem('sp_calendar_connections');
    if (cc) try { setCalendarConnections(JSON.parse(cc)); } catch(e) {}
    const ca = localStorage.getItem('sp_calendar_accounts');
    if (ca) try { setCalendarAccounts(JSON.parse(ca)); } catch(e) {}
    const savedIcs = localStorage.getItem('sp_ics_urls');
    if (savedIcs) try { setIcsUrls(JSON.parse(savedIcs)); } catch(e) {}
    const savedMagIcs = localStorage.getItem('sp_magister_ics_url');
    if (savedMagIcs) setMagisterIcsUrl(savedMagIcs);
    const savedMagIcsSync = localStorage.getItem('sp_magister_ics_last_sync');
    if (savedMagIcsSync) setMagisterIcsLastSync(savedMagIcsSync);
    const savedDark = localStorage.getItem('sp_dark_mode');
    if (savedDark === 'true') { setDarkMode(true); document.documentElement.classList.add('dark'); }
    const savedPomCount = localStorage.getItem('sp_pomodoros_today');
    const savedPomDate = localStorage.getItem('sp_pomodoros_date');
    if (savedPomCount && savedPomDate === new Date().toDateString()) {
      setPomodorosToday(parseInt(savedPomCount) || 0);
      const savedPomMins = localStorage.getItem('sp_pomodoros_minutes');
      if (savedPomMins) setPomodoroMinutesToday(parseInt(savedPomMins) || 0);
    }
    const savedNotes = localStorage.getItem('sp_notes');
    if (savedNotes) try { setNotes(JSON.parse(savedNotes)); } catch(e) {}
    // If mijnVakken already saved, skip setup
    if (savedSettings) try { const s = JSON.parse(savedSettings); if (s.mijnVakken && s.mijnVakken.length > 0) setNotitiesSetupDone(true); } catch(e) {}
    // Hash routing
    const hash = window.location.hash.slice(1);
    if (hash && ['dashboard','rooster','huiswerk','toetsen','agenda','cijfers','examens','pomodoro','notities','instellingen'].includes(hash)) {
      setCurrentPage(hash);
    }
  }, []);

  // Save to localStorage
  useEffect(() => { localStorage.setItem('sp_logged_in', isLoggedIn.toString()); }, [isLoggedIn]);
  useEffect(() => { localStorage.setItem('sp_schedule', JSON.stringify(schedule)); }, [schedule]);
  useEffect(() => { localStorage.setItem('sp_homework', JSON.stringify(homework)); }, [homework]);
  useEffect(() => { localStorage.setItem('sp_tests', JSON.stringify(tests)); }, [tests]);
  useEffect(() => { localStorage.setItem('sp_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('sp_todos', JSON.stringify(todos)); }, [todos]);
  useEffect(() => { localStorage.setItem('sp_grades', JSON.stringify(grades)); }, [grades]);
  useEffect(() => { localStorage.setItem('sp_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => {
    localStorage.setItem('sp_magister_connected', magistarConnected.toString());
    localStorage.setItem('sp_magister_account', JSON.stringify(magistarAccount));
  }, [magistarConnected, magistarAccount]);
  useEffect(() => {
    localStorage.setItem('sp_calendar_connections', JSON.stringify(calendarConnections));
    localStorage.setItem('sp_calendar_accounts', JSON.stringify(calendarAccounts));
  }, [calendarConnections, calendarAccounts]);
  useEffect(() => {
    localStorage.setItem('sp_ics_urls', JSON.stringify(icsUrls));
  }, [icsUrls]);
  useEffect(() => { localStorage.setItem('sp_notes', JSON.stringify(notes)); }, [notes]);

  // Navigate
  const navigate = useCallback((page) => {
    setCurrentPage(page);
    window.location.hash = page === 'dashboard' ? '' : page;
    window.scrollTo(0, 0);
  }, []);

  // --- Streak ---
  function loadStreak() {
    try {
      const saved = localStorage.getItem('sp_streak');
      if (!saved) return 0;
      const data = JSON.parse(saved);
      const lastDate = new Date(data.lastDate);
      if (lastDate.toDateString() === today.toDateString()) return data.count;
      if (lastDate.toDateString() === daysFromNow(-1).toDateString()) return data.count;
      return 0;
    } catch { return 0; }
  }

  function updateStreak() {
    let count = 1;
    try {
      const saved = localStorage.getItem('sp_streak');
      if (saved) {
        const data = JSON.parse(saved);
        const lastDate = new Date(data.lastDate);
        if (lastDate.toDateString() === today.toDateString()) return data.count;
        if (lastDate.toDateString() === daysFromNow(-1).toDateString()) count = data.count + 1;
      }
    } catch {}
    localStorage.setItem('sp_streak', JSON.stringify({ lastDate: today.toISOString(), count }));
    return count;
  }

  // --- ICS Calendar Import ---
  function parseICS(icsText) {
    const events = [];
    const vevents = icsText.split('BEGIN:VEVENT');
    for (let i = 1; i < vevents.length; i++) {
      const block = vevents[i].split('END:VEVENT')[0];
      const get = (key) => {
        const regex = new RegExp(`^${key}[^:]*:(.*)$`, 'm');
        const match = block.match(regex);
        return match ? match[1].trim().replace(/\\n/g, ' ').replace(/\\,/g, ',') : '';
      };
      const summary = get('SUMMARY');
      const dtstart = get('DTSTART');
      const dtend = get('DTEND');
      if (!summary || !dtstart) continue;

      // Parse date (handles both 20260328T090000Z and 20260328 formats)
      const parseICSDate = (dt) => {
        const clean = dt.replace(/[^0-9T]/g, '');
        if (clean.length >= 8) {
          const y = parseInt(clean.slice(0,4));
          const m = parseInt(clean.slice(4,6)) - 1;
          const d = parseInt(clean.slice(6,8));
          if (clean.includes('T') && clean.length >= 15) {
            const h = parseInt(clean.slice(9,11));
            const min = parseInt(clean.slice(11,13));
            return new Date(y, m, d, h, min);
          }
          return new Date(y, m, d);
        }
        return new Date(dt);
      };

      const start = parseICSDate(dtstart);
      if (isNaN(start.getTime())) continue;

      let time = 'Hele dag';
      if (dtstart.includes('T')) {
        const hh = String(start.getHours()).padStart(2, '0');
        const mm = String(start.getMinutes()).padStart(2, '0');
        time = `${hh}:${mm}`;
        if (dtend) {
          const end = parseICSDate(dtend);
          if (!isNaN(end.getTime())) {
            const eh = String(end.getHours()).padStart(2, '0');
            const em = String(end.getMinutes()).padStart(2, '0');
            time = `${hh}:${mm} - ${eh}:${em}`;
          }
        }
      }

      events.push({
        id: 50000 + i + Math.floor(Math.random() * 10000),
        date: start,
        title: summary,
        time,
        type: 'ics',
        source: 'ics',
      });
    }
    return events;
  }

  async function fetchICSCalendar(key, url) {
    try {
      const res = await fetch('/api/ics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const parsed = parseICS(data.data);
      // Remove old ICS events from this source, add new ones
      setEvents(prev => [
        ...prev.filter(e => e.source !== `ics_${key}`),
        ...parsed.map(e => ({ ...e, source: `ics_${key}` })),
      ]);
      return parsed.length;
    } catch (err) {
      throw err;
    }
  }

  async function refreshAllICS() {
    const urls = icsUrls;
    if (!urls || Object.keys(urls).length === 0) return;
    setIcsLoading(true);
    setIcsError('');
    let totalImported = 0;
    for (const [key, info] of Object.entries(urls)) {
      try {
        totalImported += await fetchICSCalendar(key, info.url);
      } catch (err) {
        console.error(`ICS fetch failed for ${key}:`, err);
      }
    }
    setIcsLoading(false);
    return totalImported;
  }

  // Auto-refresh ICS calendars on mount
  useEffect(() => {
    const savedIcs = localStorage.getItem('sp_ics_urls');
    if (savedIcs) {
      try {
        const urls = JSON.parse(savedIcs);
        if (Object.keys(urls).length > 0) {
          // Small delay to let state settle
          const timer = setTimeout(() => refreshAllICS(), 1000);
          return () => clearTimeout(timer);
        }
      } catch {}
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Magister ICS Rooster Import ---
  async function importMagisterICS(url) {
    if (!url || !url.trim()) return;
    setMagisterIcsLoading(true);
    setMagisterIcsError('');
    try {
      const res = await fetch('/api/ics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Parse VEVENT blocks into schedule items
      const icsText = data.data;
      const vevents = icsText.split('BEGIN:VEVENT');
      const dayMap = { 0: 'zondag', 1: 'maandag', 2: 'dinsdag', 3: 'woensdag', 4: 'donderdag', 5: 'vrijdag', 6: 'zaterdag' };
      const newSchedule = { maandag: [], dinsdag: [], woensdag: [], donderdag: [], vrijdag: [] };

      // Determine current week's Monday
      const now = new Date();
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setHours(0,0,0,0);
      monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 5);
      friday.setHours(23,59,59,999);

      for (let i = 1; i < vevents.length; i++) {
        const block = vevents[i].split('END:VEVENT')[0];
        const get = (key) => {
          const regex = new RegExp(`^${key}[^:]*:(.*)$`, 'm');
          const match = block.match(regex);
          return match ? match[1].trim().replace(/\\n/g, ' ').replace(/\\,/g, ',') : '';
        };

        const summary = get('SUMMARY');
        const dtstart = get('DTSTART');
        const dtend = get('DTEND');
        const location = get('LOCATION');
        const description = get('DESCRIPTION');
        if (!summary || !dtstart) continue;

        const parseICSDate = (dt) => {
          const clean = dt.replace(/[^0-9T]/g, '');
          if (clean.length >= 15) {
            const y = parseInt(clean.slice(0,4)), m = parseInt(clean.slice(4,6))-1, d = parseInt(clean.slice(6,8));
            const h = parseInt(clean.slice(9,11)), min = parseInt(clean.slice(11,13));
            // If ends with Z, it's UTC
            if (dt.includes('Z')) return new Date(Date.UTC(y, m, d, h, min));
            return new Date(y, m, d, h, min);
          }
          if (clean.length >= 8) {
            return new Date(parseInt(clean.slice(0,4)), parseInt(clean.slice(4,6))-1, parseInt(clean.slice(6,8)));
          }
          return new Date(dt);
        };

        const start = parseICSDate(dtstart);
        if (isNaN(start.getTime())) continue;
        // Only import this week's events
        if (start < monday || start > friday) continue;

        const dayName = dayMap[start.getDay()];
        if (!newSchedule[dayName]) continue; // skip weekend

        const isAllDay = !dtstart.includes('T');
        let timeStr;
        let hour;
        if (isAllDay) {
          timeStr = 'Hele dag';
          hour = 0;
        } else {
          const startH = String(start.getHours()).padStart(2,'0');
          const startM = String(start.getMinutes()).padStart(2,'0');
          timeStr = `${startH}:${startM}`;
          if (dtend) {
            const endDate = parseICSDate(dtend);
            if (!isNaN(endDate.getTime())) {
              const endH = String(endDate.getHours()).padStart(2,'0');
              const endM = String(endDate.getMinutes()).padStart(2,'0');
              timeStr = `${startH}:${startM} - ${endH}:${endM}`;
            }
          }
          const startMinutes = start.getHours() * 60 + start.getMinutes();
          hour = Math.max(1, Math.floor((startMinutes - 8 * 60) / 50) + 1);
        }

        // Try to match subject to known subjects
        const summaryLower = summary.toLowerCase();
        const matchedSubject = Object.keys(subjects).find(k => {
          const name = subjects[k].name.toLowerCase();
          return summaryLower.includes(name) || name.includes(summaryLower);
        });

        // Extract teacher from description (first line or "Docent: xxx")
        let teacher = '';
        if (description) {
          const teacherMatch = description.match(/(?:docent|leraar|teacher)[:\s]*([^\n,;]+)/i);
          teacher = teacherMatch ? teacherMatch[1].trim() : '';
        }

        newSchedule[dayName].push({
          hour,
          time: timeStr,
          subject: matchedSubject || summary.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12),
          room: location || '',
          _customName: matchedSubject ? '' : summary,
          _teacher: teacher || (description ? description.split(/[\n,;]/)[0].trim().slice(0, 40) : ''),
          _fromIcs: true,
        });
      }

      // Sort each day by hour
      for (const day of Object.keys(newSchedule)) {
        newSchedule[day].sort((a, b) => a.hour - b.hour);
      }

      // Merge: replace schedule with ICS data
      setSchedule(newSchedule);

      // Save URL and sync time
      setMagisterIcsUrl(url.trim());
      localStorage.setItem('sp_magister_ics_url', url.trim());
      const syncTime = new Date().toLocaleString('nl-NL');
      setMagisterIcsLastSync(syncTime);
      localStorage.setItem('sp_magister_ics_last_sync', syncTime);

      setModal(null);
    } catch (err) {
      setMagisterIcsError(err.message || 'Kon de ICS-link niet laden');
    } finally {
      setMagisterIcsLoading(false);
    }
  }

  // Auto-refresh Magister ICS on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('sp_magister_ics_url');
    if (savedUrl) {
      const timer = setTimeout(() => importMagisterICS(savedUrl), 1500);
      return () => clearTimeout(timer);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Dark Mode ---
  function toggleDarkMode() {
    setDarkMode(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('sp_dark_mode', next.toString());
      return next;
    });
  }

  // --- Pomodoro Timer ---
  // Build combined vak options for homework/tests/grades selects
  const schoolVakken = settings.schoolVakken || [];
  const alleExamVakkenFlat = [...new Set(Object.values(examVakkenPerNiveau).flat())].sort();
  const vakOpties = schoolVakken.length > 0
    ? schoolVakken.map(name => {
        const key = Object.entries(subjects).find(([,s]) => s.name === name)?.[0] || name.toLowerCase().replace(/[^a-z]/g,'');
        return [key, { name, color: subjects[key]?.color || 'var(--gray-400)' }];
      })
    : [...Object.entries(subjects).map(([k,s]) => [k, s]), ...alleExamVakkenFlat.filter(v => !Object.values(subjects).some(s => s.name === v)).map(v => [v.toLowerCase().replace(/[^a-z]/g,''), { name: v, color: 'var(--gray-400)' }])];

  const isDefaultPomodoro = (settings.pomodoroWork || 25) === 25 && (settings.pomodoroBreak || 5) === 5 && (settings.pomodoroLongBreak || 15) === 15 && (settings.pomodoroRounds || 4) === 4;
  const timerName = isDefaultPomodoro ? 'Pomodoro' : 'Studietimer';
  const pomodoroPhaseLabel = pomodoroPhase === 'work' ? 'Studeren' : pomodoroPhase === 'break' ? 'Korte pauze' : 'Lange pauze';
  const pomWork = (settings.pomodoroWork || 25) * 60;
  const pomBreak = (settings.pomodoroBreak || 5) * 60;
  const pomLongBreak = (settings.pomodoroLongBreak || 15) * 60;
  const pomRounds = settings.pomodoroRounds || 4;
  const phaseDurations = { work: pomWork, break: pomBreak, longBreak: pomLongBreak };

  useEffect(() => {
    if (pomodoroRunning) {
      pomodoroRef.current = setInterval(() => {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            // Phase complete
            clearInterval(pomodoroRef.current);
            // Play sound (user interaction required, so wrap safely)
            try { const a = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH+Jj4KCi5WMjImOm5eUk5yloZ2cp6+qp6awubOwtLy3tLW+wLy9v8LFv8PDxcTGx8fIycjJyMjHxsbFxMPCwb++vby7urm4t7a1tLOysbCvra+sq6qpqKelpqOioJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAgX9+fXt9e3p5eHd2dXRzc3Fxb3BubW1ram1pampnaGZnZGVjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENDQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/'); a.volume=0.5; a.play().catch(() => {}); } catch {}
            // Browser notification (optional)
            try { if ('Notification' in window && Notification.permission === 'granted') { new Notification(timerName, { body: pomodoroPhase === 'work' ? 'Tijd voor pauze!' : 'Tijd om te studeren!' }); } } catch {}
            // In-app alert (visible on every page)
            const alertMsg = pomodoroPhase === 'work' ? 'Studiesessie klaar! Tijd voor pauze.' : 'Pauze voorbij! Tijd om te studeren.';
            const alertType = pomodoroPhase === 'work' ? 'break' : 'work';
            setTimerAlert({ message: alertMsg, type: alertType });
            setPomodoroRunning(false);
            if (pomodoroPhase === 'work') {
              const newCount = pomodorosToday + 1;
              const newMins = pomodoroMinutesToday + (settings.pomodoroWork || 25);
              setPomodorosToday(newCount);
              setPomodoroMinutesToday(newMins);
              localStorage.setItem('sp_pomodoros_today', newCount.toString());
              localStorage.setItem('sp_pomodoros_minutes', newMins.toString());
              localStorage.setItem('sp_pomodoros_date', new Date().toDateString());
              if (pomodoroRound >= pomRounds) {
                setPomodoroPhase('longBreak');
                setPomodoroRound(1);
                return phaseDurations.longBreak;
              } else {
                setPomodoroPhase('break');
                return phaseDurations.break;
              }
            } else {
              setPomodoroPhase('work');
              if (pomodoroPhase === 'longBreak') setPomodoroRound(1);
              else setPomodoroRound(r => r + 1);
              return phaseDurations.work;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (pomodoroRef.current) {
      clearInterval(pomodoroRef.current);
    }
    return () => { if (pomodoroRef.current) clearInterval(pomodoroRef.current); };
  }, [pomodoroRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  function resetPomodoro() {
    setPomodoroRunning(false);
    setPomodoroPhase('work');
    setPomodoroTime(pomWork);
    setPomodoroRound(1);
  }

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // --- Magister OAuth2 Flow ---
  function startMagisterOAuth() {
    window.location.href = 'https://accounts.magister.net/connect/authorize?client_id=M6LOAPP&redirect_uri=http://localhost:3000/api/magister/callback&response_type=code&scope=openid+profile+email+offline_access';
  }

  // Handle OAuth callback result (URL params after redirect back)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const magisterSuccess = params.get('magister_success');
    const magisterError = params.get('magister_error');
    if (magisterSuccess === 'true') {
      // OAuth succeeded — fetch data from Magister using the stored token
      setMagistarLoading(true);
      setMagistarError('');

      fetch('/api/magister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'all' }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setMagistarError(data.error);
            setMagistarLoading(false);
            return;
          }

          // Save connection state
          setMagistarConnected(true);
          setMagistarAccount({ school: data.school || 'Magister', user: data.userName || 'Onbekend' });

          // Import grades if available
          if (data.grades && data.grades.length > 0) {
            const newGrades = {};
            data.grades.forEach(g => {
              const subjectKey = Object.keys(subjects).find(
                k => subjects[k].name.toLowerCase() === g.subject.toLowerCase()
              ) || g.subjectCode.toLowerCase();
              if (!newGrades[subjectKey]) newGrades[subjectKey] = { grades: [] };
              const val = parseFloat(g.grade);
              if (!isNaN(val)) {
                newGrades[subjectKey].grades.push({
                  value: val,
                  description: g.description || 'Cijfer',
                  weight: g.weight || 1,
                  date: g.date || new Date().toISOString().split('T')[0],
                });
              }
            });
            if (Object.keys(newGrades).length > 0) {
              setGrades(prev => ({ ...prev, ...newGrades }));
            }
          }

          // Import homework if available
          if (data.homework && data.homework.length > 0) {
            const newHw = data.homework.map((h, i) => ({
              id: 1000 + i,
              subject: Object.keys(subjects).find(k => subjects[k].name.toLowerCase() === h.subject.toLowerCase()) || 'wiskunde',
              title: h.title,
              due: new Date(h.date),
              done: h.done,
            }));
            setHomework(prev => [...prev, ...newHw]);
          }

          setMagistarLoading(false);
        })
        .catch(() => {
          setMagistarError('Kan geen verbinding maken met de server');
          setMagistarLoading(false);
        });

      // Clean up URL params
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    }

    if (magisterError) {
      setMagistarError(decodeURIComponent(magisterError));
      // Clean up URL params
      window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Notifications dropdown ---
  // --- Dynamic notifications ---
  const notifs = (() => {
    const items = [];
    // Homework due today
    homework.filter(h => !h.done && new Date(h.due).toDateString() === today.toDateString()).forEach(h => {
      items.push({ icon: '📝', bg: '#DBEAFE', text: `${h.title} moet vandaag ingeleverd worden`, time: 'Vandaag', action: () => navigate('huiswerk') });
    });
    // Homework due tomorrow
    const tomorrow = daysFromNow(1);
    homework.filter(h => !h.done && new Date(h.due).toDateString() === tomorrow.toDateString()).forEach(h => {
      items.push({ icon: '📝', bg: '#E0E7FF', text: `${h.title} moet morgen ingeleverd worden`, time: 'Morgen', action: () => navigate('huiswerk') });
    });
    // Tests coming up (next 3 days)
    tests.filter(t => { const diff = (new Date(t.date) - today) / 86400000; return diff >= 0 && diff <= 3; }).forEach(t => {
      const s = subjects[t.subject];
      const diff = Math.round((new Date(t.date) - today) / 86400000);
      const when = diff === 0 ? 'Vandaag' : diff === 1 ? 'Morgen' : `Over ${diff} dagen`;
      items.push({ icon: '📅', bg: '#FEF3C7', text: `Toets ${s?.name || ''}: ${t.title}`, time: when, action: () => navigate('toetsen') });
    });
    // Events today
    events.filter(e => e.source !== 'ics' && new Date(e.date).toDateString() === today.toDateString()).forEach(e => {
      items.push({ icon: '🏫', bg: '#FCE7F3', text: e.title, time: `Vandaag om ${e.time}`, action: () => navigate('agenda') });
    });
    // Recent grades (show latest)
    Object.entries(grades).forEach(([subjectId, data]) => {
      const s = subjects[subjectId];
      if (s && data.grades && data.grades.length > 0) {
        const lastGrade = data.grades[data.grades.length - 1];
        if (typeof lastGrade === 'object') {
          items.push({ icon: '📊', bg: '#D1FAE5', text: `${s.name}: ${lastGrade.value} — ${lastGrade.description || ''}`, time: 'Recent', action: () => navigate('cijfers') });
        }
      }
    });
    if (items.length === 0) {
      items.push({ icon: '✅', bg: '#D1FAE5', text: 'Geen nieuwe meldingen!', time: 'Nu' });
    }
    return items.slice(0, 8);
  })();

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => { setNotifOpen(false); setProfileOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // --- Computed ---
  const todaySchedule = (() => {
    const d = today.getDay();
    if (d === 0 || d === 6) return schedule.maandag || [];
    return schedule[dayNames[d - 1]] || [];
  })();

  const todayHw = homework.filter(h => new Date(h.due).toDateString() === today.toDateString() && !h.done);
  const weekTests = tests.filter(t => { const diff = (new Date(t.date) - today) / 86400000; return diff >= 0 && diff <= 7; });
  const doneTodos = todos.filter(t => t.done).length;
  const doneHw = homework.filter(h => h.done).length;
  const streak = loadStreak();
  const firstName = settings.userName.split(' ')[0];
  const progressPct = todos.length > 0 ? Math.round((doneTodos / todos.length) * 100) : 0;
  const hwPct = homework.length > 0 ? Math.round((doneHw / homework.length) * 100) : 0;
  const overallAvg = (() => {
    const all = Object.values(grades).flatMap(s => s.grades || []);
    if (all.length === 0) return '0.0';
    return getAverage(all);
  })();

  // --- Generate hour times from settings (with optional per-day override) ---
  function getHourTimes(day) {
    const overrides = settings.dayOverrides || {};
    const daySettings = overrides[day] || {};
    const duration = daySettings.lessonDuration || settings.lessonDuration;
    const startTimeStr = daySettings.startTime || settings.startTime;
    const breakAfter = daySettings.breakAfter ?? settings.breakAfter;
    const breakDuration = daySettings.breakDuration ?? settings.breakDuration;
    const lunchAfter = daySettings.lunchAfter ?? settings.lunchAfter;
    const lunchDuration = daySettings.lunchDuration ?? settings.lunchDuration;
    const break2Enabled = daySettings.break2Enabled ?? settings.break2Enabled ?? false;
    const break2After = daySettings.break2After ?? settings.break2After ?? 6;
    const break2Duration = daySettings.break2Duration ?? settings.break2Duration ?? 15;

    const maxLessons = daySettings.maxLessons || settings.maxLessons || 8;
    const start = startTimeStr.split(':').map(Number);
    let minutes = start[0] * 60 + start[1];
    const result = {};
    for (let i = 1; i <= maxLessons; i++) {
      const startH = Math.floor(minutes / 60);
      const startM = minutes % 60;
      const endMin = minutes + duration;
      const endH = Math.floor(endMin / 60);
      const endM = endMin % 60;
      result[i] = `${String(startH).padStart(2,'0')}:${String(startM).padStart(2,'0')} - ${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`;
      minutes = endMin;
      if (i === breakAfter) minutes += breakDuration;
      else if (i === lunchAfter) minutes += lunchDuration;
      else if (break2Enabled && i === break2After) minutes += break2Duration;
    }
    return result;
  }

  // --- Settings timetable preview ---
  function generateTimetablePreview(day) {
    const overrides = settings.dayOverrides || {};
    const daySettings = day ? (overrides[day] || {}) : {};
    const duration = daySettings.lessonDuration || settings.lessonDuration;
    const startTimeStr = daySettings.startTime || settings.startTime;
    const breakAfter = daySettings.breakAfter ?? settings.breakAfter;
    const breakDuration = daySettings.breakDuration ?? settings.breakDuration;
    const lunchAfter = daySettings.lunchAfter ?? settings.lunchAfter;
    const lunchDuration = daySettings.lunchDuration ?? settings.lunchDuration;
    const break2Enabled = daySettings.break2Enabled ?? settings.break2Enabled ?? false;
    const break2After = daySettings.break2After ?? settings.break2After ?? 6;
    const break2Duration = daySettings.break2Duration ?? settings.break2Duration ?? 15;

    const maxLessons = daySettings.maxLessons || settings.maxLessons || 8;
    const start = startTimeStr.split(':').map(Number);
    let minutes = start[0] * 60 + start[1];
    const rows = [];
    for (let i = 1; i <= maxLessons; i++) {
      const startH = Math.floor(minutes / 60);
      const startM = minutes % 60;
      const endMin = minutes + duration;
      const endH = Math.floor(endMin / 60);
      const endM = endMin % 60;
      const timeStr = `${String(startH).padStart(2,'0')}:${String(startM).padStart(2,'0')} - ${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`;
      rows.push({ label: `${i}e uur`, time: timeStr, isBreak: false });
      minutes = endMin;
      if (i === breakAfter) {
        rows.push({ label: 'Pauze', time: `${breakDuration} min`, isBreak: true });
        minutes += breakDuration;
      } else if (i === lunchAfter) {
        rows.push({ label: 'Lunch', time: `${lunchDuration} min`, isBreak: true });
        minutes += lunchDuration;
      } else if (break2Enabled && i === break2After) {
        rows.push({ label: 'Pauze 2', time: `${break2Duration} min`, isBreak: true });
        minutes += break2Duration;
      }
    }
    return rows;
  }

  // --- Mini Calendar ---
  function renderMiniCalendar(year, month) {
    const monthNames = ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'];
    const dayNamesShort = ['Ma','Di','Wo','Do','Vr','Za','Zo'];
    const firstDay = new Date(year, month, 1);
    let startDay = firstDay.getDay() - 1; if (startDay < 0) startDay = 6;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const eventDates = new Set();
    events.forEach(e => { const d = new Date(e.date); if (d.getMonth() === month && d.getFullYear() === year) eventDates.add(d.getDate()); });

    const cells = [];
    for (let i = startDay - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, other: true });
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      cells.push({ day: d, other: false, isToday, hasEvent: eventDates.has(d) });
    }
    const total = startDay + daysInMonth;
    const remaining = (7 - (total % 7)) % 7;
    for (let d = 1; d <= remaining; d++) cells.push({ day: d, other: true });

    return (
      <div className="mini-calendar">
        <div className="mini-calendar-header">
          <h4>{monthNames[month]} {year}</h4>
          <div className="mini-calendar-nav">
            <button onClick={() => { let m=month-1,y=year; if(m<0){m=11;y--;} setMiniCalMonth(m); setMiniCalYear(y); }}>{icons.chevronLeft}</button>
            <button onClick={() => { let m=month+1,y=year; if(m>11){m=0;y++;} setMiniCalMonth(m); setMiniCalYear(y); }}>{icons.chevronRight}</button>
          </div>
        </div>
        <div className="mini-calendar-grid">
          {dayNamesShort.map(d => <div key={d} className="mini-calendar-day-name">{d}</div>)}
          {cells.map((c, i) => (
            <div key={i} className={`mini-calendar-day${c.other ? ' other-month' : ''}${c.isToday ? ' today' : ''}${c.hasEvent ? ' has-event' : ''}`}>{c.day}</div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================
  // MODAL SYSTEM
  // ============================================================
  function openMagisterModal(source) {
    setMagistarError('');
    setModal({ type: 'magister', source });
  }

  function openCalendarConnectModal() { setModal({ type: 'calendarList' }); }
  // openCalendarLoginModal removed — ICS flow used instead

  function renderModal() {
    if (!modal) return null;

    let title = '';
    let body = null;

    if (modal.type === 'magister') {
      title = 'Koppel met Magister';
      body = (
        <div className="connect-modal">
          <div className="connect-icon-large">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={magistarConnected ? '#22C55E' : '#3B82F6'} strokeWidth="1.5">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          {magistarConnected ? (
            <>
              <div className="connect-status connected"><span className="connect-status-dot active"></span> Verbonden met Magister</div>
              <p className="connect-desc">Je gegevens worden automatisch gesynchroniseerd met Magister.</p>
              <div className="connect-info-box">
                <div className="connect-info-row"><span>Account</span><strong>{magistarAccount.user || 'Onbekend'}</strong></div>
                <div className="connect-info-row"><span>School</span><strong>{magistarAccount.school || 'Onbekend'}</strong></div>
                <div className="connect-info-row"><span>Laatst gesync</span><strong>Vandaag, {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}</strong></div>
              </div>
              <button className="btn btn-outline" style={{width:'100%',justifyContent:'center',marginTop:12}} onClick={() => {
                setMagistarConnected(false); setMagistarAccount({}); setModal(null);
              }}>Ontkoppelen</button>
            </>
          ) : magistarLoading ? (
            <>
              <p className="connect-desc">Gegevens ophalen van Magister...</p>
              <div style={{display:'flex',justifyContent:'center',padding:'20px 0'}}>
                <div style={{width:32,height:32,border:'3px solid var(--gray-200)',borderTopColor:'var(--accent)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </>
          ) : (
            <>
              <p className="connect-desc">Koppel je Magister account om je cijfers, huiswerk en rooster automatisch te importeren. Je wordt doorgestuurd naar Magister om in te loggen.</p>
              {magistarError && <p style={{color:'#EF4444',fontSize:'0.85rem',marginBottom:12,background:'#FEF2F2',padding:'8px 12px',borderRadius:8}}>{magistarError}</p>}
              <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8,gap:10}} onClick={() => startMagisterOAuth()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                Login met Magister
              </button>
              <p style={{fontSize:'0.75rem',color:'var(--gray-400)',marginTop:16,textAlign:'center',lineHeight:1.5}}>
                Je wordt doorgestuurd naar de beveiligde Magister inlogpagina. Wij slaan je wachtwoord niet op.
              </p>
            </>
          )}
        </div>
      );
    }

    if (modal.type === 'calendarList') {
      title = 'Kalender importeren via ICS';
      const connectedIcs = Object.entries(icsUrls);
      body = (
        <div className="connect-modal">
          <p className="connect-desc">Importeer je kalender via een ICS-link. Je events worden automatisch gesynchroniseerd bij elke keer openen.</p>
          {icsError && <p style={{color:'#EF4444',fontSize:'0.85rem',marginBottom:12,background:'#FEF2F2',padding:'8px 12px',borderRadius:8}}>{icsError}</p>}
          {connectedIcs.length > 0 && (
            <div style={{marginBottom:16}}>
              <div style={{fontSize:'0.8rem',fontWeight:600,color:'var(--gray-500)',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>Gekoppelde kalenders</div>
              {connectedIcs.map(([key, info]) => (
                <div key={key} className="calendar-connect-item connected" style={{marginBottom:8}}>
                  <div className="calendar-connect-info">
                    <span className="calendar-connect-icon" style={{color:'#3730A3'}}>📅</span>
                    <div>
                      <div className="calendar-connect-name">{info.name}</div>
                      <div className="calendar-connect-status" style={{fontSize:'0.7rem',wordBreak:'break-all'}}>{info.url.slice(0,60)}...</div>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => {
                    setIcsUrls(prev => { const n = {...prev}; delete n[key]; return n; });
                    setEvents(prev => prev.filter(e => e.source !== `ics_${key}`));
                  }}>Verwijderen</button>
                </div>
              ))}
              <button className="btn btn-outline btn-sm" style={{width:'100%',justifyContent:'center',marginTop:8}} onClick={() => {
                setIcsLoading(true); setIcsError('');
                refreshAllICS().then(count => {
                  setIcsLoading(false);
                }).catch(() => setIcsLoading(false));
              }} disabled={icsLoading}>
                {icsLoading ? 'Vernieuwen...' : 'Alles vernieuwen'}
              </button>
            </div>
          )}
          <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',gap:8}} onClick={() => setModal({type:'icsAdd'})}>
            + Nieuwe kalender toevoegen
          </button>
        </div>
      );
    }

    if (modal.type === 'icsAdd') {
      title = 'ICS-kalender toevoegen';
      body = (
        <div className="connect-modal">
          <form onSubmit={async (e) => {
            e.preventDefault();
            const name = e.target.elements.icsname.value.trim();
            const url = e.target.elements.icsurl.value.trim();
            if (!url) return;
            setIcsLoading(true); setIcsError('');
            const key = 'ics_' + Date.now();
            try {
              setIcsUrls(prev => ({...prev, [key]: { name: name || 'Kalender', url }}));
              await fetchICSCalendar(key, url);
              setIcsLoading(false);
              setCalendarConnections(c => ({...c, [key]: true}));
              setModal({type:'calendarList'});
            } catch (err) {
              setIcsError(err.message || 'Kon kalender niet ophalen');
              setIcsUrls(prev => { const n = {...prev}; delete n[key]; return n; });
              setIcsLoading(false);
            }
          }}>
            <div className="form-group">
              <label className="form-label">Naam</label>
              <input type="text" className="form-input" name="icsname" placeholder="Bijv. Schoolrooster, Persoonlijk..." />
            </div>
            <div className="form-group">
              <label className="form-label">ICS-link (URL)</label>
              <input type="url" className="form-input" name="icsurl" placeholder="https://calendar.google.com/calendar/ical/..." required />
            </div>
            {icsError && <p style={{color:'#EF4444',fontSize:'0.85rem',marginBottom:12,background:'#FEF2F2',padding:'8px 12px',borderRadius:8}}>{icsError}</p>}
            <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}} disabled={icsLoading}>
              {icsLoading ? 'Importeren...' : 'Kalender importeren'}
            </button>
          </form>
          <div style={{marginTop:20,padding:16,background:'var(--gray-50)',borderRadius:12,border:'1px solid var(--gray-200)'}}>
            <div style={{fontSize:'0.85rem',fontWeight:600,marginBottom:12,color:'var(--gray-700)'}}>Waar vind ik mijn ICS-link?</div>
            <div style={{fontSize:'0.78rem',lineHeight:1.7,color:'var(--gray-500)',textAlign:'left'}}>
              <div style={{marginBottom:12}}>
                <span style={{fontWeight:600,color:'var(--gray-700)'}}>🟢 Google Kalender</span><br/>
                1. Open <em>calendar.google.com</em><br/>
                2. Klik op het tandwiel-icoon → <em>Instellingen</em><br/>
                3. Klik links op de kalender die je wilt delen<br/>
                4. Scroll naar <em>"Integreer agenda"</em><br/>
                5. Kopieer de link bij <em>"Geheim adres in iCal-indeling"</em>
              </div>
              <div style={{marginBottom:12}}>
                <span style={{fontWeight:600,color:'var(--gray-700)'}}>🍎 Apple iCloud Kalender</span><br/>
                1. Open <em>icloud.com</em> en ga naar <em>Agenda</em><br/>
                2. Klik op het deel-icoon (persoon met +) naast de kalender in de zijbalk<br/>
                3. Vink <em>"Openbare agenda"</em> aan<br/>
                4. Kopieer de getoonde webcal:// link (werkt ook als https://)
              </div>
              <div>
                <span style={{fontWeight:600,color:'var(--gray-700)'}}>📧 Outlook / Microsoft 365</span><br/>
                1. Open <em>outlook.live.com</em> of <em>outlook.office.com</em><br/>
                2. Ga naar Agenda → klik op het tandwiel → <em>Alle Outlook-instellingen weergeven</em><br/>
                3. Ga naar <em>Agenda</em> → <em>Gedeelde agenda{"'"}s</em><br/>
                4. Kies bij <em>"Een agenda publiceren"</em> je kalender, selecteer <em>"Kan alle details bekijken"</em><br/>
                5. Klik <em>Publiceren</em> en kopieer de <em>ICS-link</em>
              </div>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" style={{width:'100%',justifyContent:'center',marginTop:12}} onClick={() => { setIcsError(''); setModal({type:'calendarList'}); }}>← Terug naar overzicht</button>
        </div>
      );
    }

    if (modal.type === 'addLesson') {
      title = 'Les toevoegen';
      body = (
        <form onSubmit={(e) => {
          e.preventDefault();
          const f = e.target.elements;
          const day = f.day.value, hour = parseInt(f.hour.value), subj = f.subject.value, room = f.room.value;
          const ht = getHourTimes(day);
          setSchedule(s => {
            const ns = {...s, [day]: [...(s[day]||[]), { hour, time: ht[hour], subject: subj, room }].sort((a,b) => a.hour-b.hour)};
            return ns;
          });
          setModal(null);
        }}>
          <div className="form-group"><label className="form-label">Dag</label>
            <select className="form-select" name="day" required>{dayNames.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Uur</label>
            <select className="form-select" name="hour" required>{Object.entries(getHourTimes('maandag')).map(([h,t]) => <option key={h} value={h}>{h}e uur ({t})</option>)}</select></div>
          <div className="form-group"><label className="form-label">Vak</label>
            <select className="form-select" name="subject" required><option value="">Kies een vak...</option>{vakOpties.map(([k,s]) => <option key={k} value={k}>{s.name}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Lokaal</label>
            <input type="text" className="form-input" name="room" placeholder="Bijv. A204" required /></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>Toevoegen</button>
        </form>
      );
    }

    if (modal.type === 'editLesson') {
      const { day, index } = modal;
      const lesson = schedule[day]?.[index];
      if (!lesson) return null;
      title = 'Les bewerken';
      const editHourTimes = getHourTimes(day);
      body = (
        <form onSubmit={(e) => {
          e.preventDefault();
          const f = e.target.elements;
          const ht = getHourTimes(day);
          setSchedule(s => {
            const ns = {...s, [day]: [...s[day]]};
            ns[day][index] = { hour: parseInt(f.hour.value), time: ht[parseInt(f.hour.value)], subject: f.subject.value, room: f.room.value };
            ns[day].sort((a,b) => a.hour-b.hour);
            return ns;
          });
          setModal(null);
        }}>
          <div className="form-group"><label className="form-label">Uur</label>
            <select className="form-select" name="hour" defaultValue={lesson.hour} required>{Object.entries(editHourTimes).map(([h,t]) => <option key={h} value={h}>{h}e uur ({t})</option>)}</select></div>
          <div className="form-group"><label className="form-label">Vak</label>
            <select className="form-select" name="subject" defaultValue={lesson.subject} required>{vakOpties.map(([k,s]) => <option key={k} value={k}>{s.name}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Lokaal</label>
            <input type="text" className="form-input" name="room" defaultValue={lesson.room} required /></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>Opslaan</button>
        </form>
      );
    }

    if (modal.type === 'addHomework') {
      title = 'Huiswerk toevoegen';
      body = (
        <form onSubmit={(e) => {
          e.preventDefault();
          const f = e.target.elements;
          const newId = Math.max(100, ...homework.map(h => h.id)) + 1;
          setHomework(h => [...h, { id: newId, subject: f.subject.value, title: f.title.value, due: new Date(f.due.value), done: false }]);
          setModal(null);
        }}>
          <div className="form-group"><label className="form-label">Vak</label>
            <select className="form-select" name="subject" required><option value="">Kies een vak...</option>{vakOpties.map(([k,s]) => <option key={k} value={k}>{s.name}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Opdracht</label>
            <input type="text" className="form-input" name="title" placeholder="Beschrijf de opdracht..." required /></div>
          <div className="form-group"><label className="form-label">Deadline</label>
            <input type="date" className="form-input" name="due" required /></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>Toevoegen</button>
        </form>
      );
    }

    if (modal.type === 'editHomework') {
      const h = homework.find(x => x.id === modal.id);
      if (!h) return null;
      title = 'Huiswerk bewerken';
      body = (
        <form onSubmit={(e) => {
          e.preventDefault();
          const f = e.target.elements;
          setHomework(hw => hw.map(x => x.id === modal.id ? {...x, subject: f.subject.value, title: f.title.value, due: new Date(f.due.value)} : x));
          setModal(null);
        }}>
          <div className="form-group"><label className="form-label">Vak</label>
            <select className="form-select" name="subject" defaultValue={h.subject} required><option value="">Kies een vak...</option>{vakOpties.map(([k,s]) => <option key={k} value={k}>{s.name}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Opdracht</label>
            <input type="text" className="form-input" name="title" defaultValue={h.title} required /></div>
          <div className="form-group"><label className="form-label">Deadline</label>
            <input type="date" className="form-input" name="due" defaultValue={dateToInputStr(new Date(h.due))} required /></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>Opslaan</button>
        </form>
      );
    }

    if (modal.type === 'addTest') {
      title = 'Toets toevoegen';
      body = (
        <form onSubmit={(e) => {
          e.preventDefault();
          const f = e.target.elements;
          const newId = Math.max(100, ...tests.map(t => t.id)) + 1;
          setTests(t => [...t, { id: newId, subject: f.subject.value, title: f.title.value, date: new Date(f.date.value), chapter: f.chapter.value }]);
          setModal(null);
        }}>
          <div className="form-group"><label className="form-label">Vak</label>
            <select className="form-select" name="subject" required><option value="">Kies een vak...</option>{vakOpties.map(([k,s]) => <option key={k} value={k}>{s.name}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Titel</label>
            <input type="text" className="form-input" name="title" placeholder="Bijv. Proefwerk H5" required /></div>
          <div className="form-group"><label className="form-label">Datum</label>
            <input type="date" className="form-input" name="date" required /></div>
          <div className="form-group"><label className="form-label">Hoofdstuk / Stof</label>
            <input type="text" className="form-input" name="chapter" placeholder="Bijv. H5-6" required /></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>Toevoegen</button>
        </form>
      );
    }

    if (modal.type === 'editTest') {
      const t = tests.find(x => x.id === modal.id);
      if (!t) return null;
      title = 'Toets bewerken';
      body = (
        <form onSubmit={(e) => {
          e.preventDefault();
          const f = e.target.elements;
          setTests(ts => ts.map(x => x.id === modal.id ? {...x, subject: f.subject.value, title: f.title.value, date: new Date(f.date.value), chapter: f.chapter.value} : x));
          setModal(null);
        }}>
          <div className="form-group"><label className="form-label">Vak</label>
            <select className="form-select" name="subject" defaultValue={t.subject} required>{vakOpties.map(([k,s]) => <option key={k} value={k}>{s.name}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Titel</label>
            <input type="text" className="form-input" name="title" defaultValue={t.title} required /></div>
          <div className="form-group"><label className="form-label">Datum</label>
            <input type="date" className="form-input" name="date" defaultValue={dateToInputStr(new Date(t.date))} required /></div>
          <div className="form-group"><label className="form-label">Hoofdstuk / Stof</label>
            <input type="text" className="form-input" name="chapter" defaultValue={t.chapter} required /></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>Opslaan</button>
        </form>
      );
    }

    if (modal.type === 'addEvent') {
      title = 'Event toevoegen';
      body = (
        <form onSubmit={(e) => {
          e.preventDefault();
          const f = e.target.elements;
          const newId = Math.max(100, ...events.map(ev => ev.id)) + 1;
          setEvents(ev => [...ev, { id: newId, date: new Date(f.date.value), title: f.title.value, time: f.time.value, type: f.type.value }]);
          setModal(null);
        }}>
          <div className="form-group"><label className="form-label">Titel</label>
            <input type="text" className="form-input" name="title" placeholder="Naam van het event..." required /></div>
          <div className="form-group"><label className="form-label">Datum</label>
            <input type="date" className="form-input" name="date" defaultValue={dateToInputStr(agendaSelectedDate)} required /></div>
          <div className="form-group"><label className="form-label">Tijd</label>
            <input type="text" className="form-input" name="time" placeholder="Bijv. 09:00 - 10:00 of Hele dag" required /></div>
          <div className="form-group"><label className="form-label">Type</label>
            <select className="form-select" name="type" required>
              <option value="school">School</option><option value="deadline">Deadline</option><option value="toets">Toets</option><option value="les">Les</option>
            </select></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>Toevoegen</button>
        </form>
      );
    }

    if (modal.type === 'editEvent') {
      const ev = events.find(e => e.id === modal.id);
      if (!ev) return null;
      title = 'Event bewerken';
      body = (
        <form onSubmit={(e) => {
          e.preventDefault();
          const f = e.target.elements;
          setEvents(evs => evs.map(x => x.id === modal.id ? {...x, title: f.title.value, date: new Date(f.date.value), time: f.time.value, type: f.type.value} : x));
          setModal(null);
        }}>
          <div className="form-group"><label className="form-label">Titel</label>
            <input type="text" className="form-input" name="title" defaultValue={ev.title} required /></div>
          <div className="form-group"><label className="form-label">Datum</label>
            <input type="date" className="form-input" name="date" defaultValue={dateToInputStr(new Date(ev.date))} required /></div>
          <div className="form-group"><label className="form-label">Tijd</label>
            <input type="text" className="form-input" name="time" defaultValue={ev.time} required /></div>
          <div className="form-group"><label className="form-label">Type</label>
            <select className="form-select" name="type" defaultValue={ev.type} required>
              <option value="school">School</option><option value="deadline">Deadline</option><option value="toets">Toets</option><option value="les">Les</option>
            </select></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>Opslaan</button>
        </form>
      );
    }

    if (modal.type === 'addGrade') {
      title = 'Cijfer toevoegen';
      body = (
        <form onSubmit={(e) => {
          e.preventDefault();
          const f = e.target.elements;
          const subj = f.subject.value;
          const value = parseFloat(f.grade.value);
          const weight = parseFloat(f.weight.value) || 1;
          const description = f.description.value.trim();
          const date = f.date.value;
          if (isNaN(value)) return;
          setGrades(prev => {
            const existing = prev[subj] || { grades: [] };
            return { ...prev, [subj]: { grades: [...existing.grades, { value, description, weight, date }] } };
          });
          setModal(null);
        }}>
          <div className="form-group"><label className="form-label">Vak</label>
            <select className="form-select" name="subject" defaultValue={modal.subject || ''} required>
              <option value="">Kies een vak...</option>
              {vakOpties.map(([k,s]) => <option key={k} value={k}>{s.name}</option>)}
            </select></div>
          <div className="form-group"><label className="form-label">Cijfer</label>
            <input type="number" className="form-input" name="grade" step="0.1" min="1" max="10" placeholder="Bijv. 7.5" required /></div>
          <div className="form-group"><label className="form-label">Weging</label>
            <input type="number" className="form-input" name="weight" step="0.1" min="0.1" max="10" defaultValue="1" placeholder="Bijv. 1, 2, 0.5" required />
            <div style={{display:'flex',gap:4,marginTop:6,flexWrap:'wrap'}}>
              {[{v:'0.25',l:'Klein SO'},{v:'0.5',l:'SO'},{v:'1',l:'Toets'},{v:'2',l:'Proefwerk'},{v:'3',l:'Tentamen'}].map(w => (
                <button key={w.v} type="button" className="btn btn-outline btn-sm" style={{fontSize:'0.7rem',padding:'2px 8px'}}
                  onClick={e => { e.preventDefault(); e.target.closest('.form-group').querySelector('input').value = w.v; }}>{w.v}x {w.l}</button>
              ))}
            </div></div>
          <div className="form-group"><label className="form-label">Omschrijving</label>
            <input type="text" className="form-input" name="description" placeholder="Bijv. Proefwerk H3" required /></div>
          <div className="form-group"><label className="form-label">Datum</label>
            <input type="date" className="form-input" name="date" defaultValue={dateToInputStr(today)} required /></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>Cijfer opslaan</button>
        </form>
      );
    }

    if (modal.type === 'editGrade') {
      const { subjectId, gradeIndex } = modal;
      const gradeData = grades[subjectId]?.grades[gradeIndex];
      if (!gradeData) return null;
      title = 'Cijfer bewerken';
      body = (
        <form onSubmit={(e) => {
          e.preventDefault();
          const f = e.target.elements;
          setGrades(prev => {
            const newGrades = {...prev};
            const arr = [...newGrades[subjectId].grades];
            arr[gradeIndex] = { ...arr[gradeIndex], value: parseFloat(f.grade.value), weight: parseFloat(f.weight.value), description: f.description.value.trim(), date: f.date.value };
            newGrades[subjectId] = { grades: arr };
            return newGrades;
          });
          setModal(null);
        }}>
          <div className="form-group"><label className="form-label">Cijfer</label>
            <input type="number" className="form-input" name="grade" step="0.1" min="1" max="10" defaultValue={gradeData.value} required /></div>
          <div className="form-group"><label className="form-label">Weging</label>
            <select className="form-select" name="weight" defaultValue={gradeData.weight || 1}>
              <option value="0.25">0.25x — Klein SO</option>
              <option value="0.5">0.5x — SO / Practicum</option>
              <option value="1">1x — Toets</option>
              <option value="2">2x — Proefwerk</option>
              <option value="3">3x — Tentamen / Eindtoets</option>
            </select></div>
          <div className="form-group"><label className="form-label">Omschrijving</label>
            <input type="text" className="form-input" name="description" defaultValue={gradeData.description} required /></div>
          <div className="form-group"><label className="form-label">Datum</label>
            <input type="date" className="form-input" name="date" defaultValue={gradeData.date || ''} required /></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:8}}>Opslaan</button>
          <button type="button" className="btn btn-outline" style={{width:'100%',justifyContent:'center',marginTop:8,color:'#EF4444',borderColor:'#FCA5A5'}} onClick={() => {
            setGrades(prev => {
              const newGrades = {...prev};
              const arr = [...newGrades[subjectId].grades];
              arr.splice(gradeIndex, 1);
              newGrades[subjectId] = { grades: arr };
              if (arr.length === 0) delete newGrades[subjectId];
              return newGrades;
            });
            setModal(null);
          }}>Cijfer verwijderen</button>
        </form>
      );
    }

    if (modal.type === 'roosterWizard') {
      const currentDayName = dayNames[wizardDay];
      const currentDayLabel = dayLabels[wizardDay];
      const currentLessons = wizardSchedule[currentDayName] || [];
      const dayHourTimes = getHourTimes(currentDayName);
      const availableHours = Object.entries(dayHourTimes).filter(([h]) => !currentLessons.some(l => l.hour === parseInt(h)));

      title = `Rooster maken — ${currentDayLabel}`;
      body = (
        <div>
          <div style={{display:'flex',gap:4,marginBottom:16}}>
            {dayLabels.map((d, i) => (
              <button key={d} className={`btn btn-sm ${i === wizardDay ? 'btn-primary' : i < wizardDay ? 'btn-outline' : 'btn-outline'}`}
                style={{flex:1,justifyContent:'center',opacity: i < wizardDay ? 0.6 : 1, position:'relative'}}
                onClick={() => setWizardDay(i)}>
                {d.slice(0,2)}
                {(wizardSchedule[dayNames[i]] || []).length > 0 && <span style={{position:'absolute',top:-3,right:-3,width:7,height:7,background:'var(--accent)',borderRadius:'50%'}}></span>}
              </button>
            ))}
          </div>

          <div style={{fontSize:'0.82rem',color:'var(--gray-500)',marginBottom:12}}>
            Stap {wizardDay + 1} van 5 — Voeg lessen toe voor <strong>{currentDayLabel}</strong>
            {currentLessons.length > 0 && <span style={{color:'var(--accent)'}}> ({currentLessons.length} lessen)</span>}
          </div>

          {currentLessons.length > 0 && (
            <div style={{marginBottom:14,display:'flex',flexDirection:'column',gap:6}}>
              {currentLessons.sort((a,b) => a.hour - b.hour).map((l, i) => {
                const s = subjects[l.subject];
                return (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',background:'var(--gray-50)',borderRadius:'var(--radius)',border:'1px solid var(--gray-100)'}}>
                    <span style={{fontSize:'0.78rem',fontWeight:600,color:'var(--gray-500)',minWidth:55}}>{l.hour}e uur</span>
                    <span style={{width:8,height:8,borderRadius:'50%',background:s?.color || 'var(--gray-300)'}}></span>
                    <span style={{flex:1,fontSize:'0.85rem',fontWeight:500,color:'var(--gray-700)'}}>{s?.name || l.subject}</span>
                    <span style={{fontSize:'0.78rem',color:'var(--gray-400)'}}>{l.room}</span>
                    <button style={{background:'none',border:'none',cursor:'pointer',color:'var(--gray-400)',padding:2}} onClick={() => {
                      setWizardSchedule(ws => ({...ws, [currentDayName]: ws[currentDayName].filter((_, idx) => idx !== i)}));
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {availableHours.length > 0 ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              const f = e.target.elements;
              const hour = parseInt(f.wiz_hour.value);
              const subj = f.wiz_subject.value;
              const room = f.wiz_room.value;
              if (!subj) return;
              setWizardSchedule(ws => ({
                ...ws,
                [currentDayName]: [...ws[currentDayName], { hour, time: dayHourTimes[hour], subject: subj, room }].sort((a,b) => a.hour - b.hour),
              }));
              e.target.reset();
            }}>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                <div className="form-group" style={{flex:'0 0 80px'}}>
                  <label className="form-label">Uur</label>
                  <select className="form-select" name="wiz_hour" required>
                    {availableHours.map(([h, t]) => <option key={h} value={h}>{h}e</option>)}
                  </select>
                </div>
                <div className="form-group" style={{flex:1,minWidth:120}}>
                  <label className="form-label">Vak</label>
                  <select className="form-select" name="wiz_subject" required>
                    <option value="">Kies...</option>
                    {vakOpties.map(([k,s]) => <option key={k} value={k}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{flex:'0 0 90px'}}>
                  <label className="form-label">Lokaal</label>
                  <input type="text" className="form-input" name="wiz_room" placeholder="A204" />
                </div>
                <div className="form-group" style={{flex:'0 0 auto',display:'flex',alignItems:'flex-end'}}>
                  <button type="submit" className="btn btn-primary btn-sm" style={{height:38}}><Icon name="plus" size={14} /></button>
                </div>
              </div>
            </form>
          ) : (
            <div style={{textAlign:'center',padding:12,color:'var(--gray-400)',fontSize:'0.82rem'}}>Alle uren zijn ingevuld voor {currentDayLabel}</div>
          )}

          {currentLessons.length === 0 && (
            <div style={{textAlign:'center',padding:'8px 0',fontSize:'0.8rem',color:'var(--gray-400)'}}>Geen lessen? Klik op volgende om deze dag over te slaan.</div>
          )}

          <div style={{display:'flex',gap:8,marginTop:16,borderTop:'1px solid var(--gray-100)',paddingTop:16}}>
            <button className="btn btn-outline" style={{flex:1,justifyContent:'center'}} disabled={wizardDay === 0}
              onClick={() => setWizardDay(d => d - 1)}>← Vorige</button>
            {wizardDay < 4 ? (
              <button className="btn btn-primary" style={{flex:1,justifyContent:'center'}}
                onClick={() => setWizardDay(d => d + 1)}>Volgende →</button>
            ) : (
              <button className="btn btn-primary" style={{flex:1,justifyContent:'center'}}
                onClick={() => {
                  setSchedule(wizardSchedule);
                  setModal(null);
                }}>Rooster opslaan</button>
            )}
          </div>

          <div style={{fontSize:'0.72rem',color:'var(--gray-400)',textAlign:'center',marginTop:10}}>
            Dit rooster herhaalt zich elke week totdat je het wijzigt.
          </div>
        </div>
      );
    }

    if (modal.type === 'magisterIcs') {
      title = 'Rooster Importeren via ICS';
      body = (
        <div>
          <div style={{background:'#FEF3C7',borderRadius:'var(--radius)',padding:'10px 14px',marginBottom:12,fontSize:'0.78rem',color:'#92400E',lineHeight:1.6}}>
            ⚠️ Deze instructies kunnen verouderd zijn door updates van de apps. Zoek anders op &quot;[naam kalender] ICS link exporteren&quot; voor de nieuwste stappen.
          </div>
          <div style={{background:'var(--gray-50)',borderRadius:'var(--radius)',padding:16,marginBottom:16}}>
            <div style={{fontWeight:600,fontSize:'0.88rem',color:'var(--gray-800)',marginBottom:12}}>Hoe vind je de ICS-link?</div>
            <details style={{marginBottom:10}}>
              <summary style={{fontWeight:600,fontSize:'0.84rem',color:'var(--gray-700)',cursor:'pointer',marginBottom:6}}>🏫 Magister</summary>
              <ol style={{margin:0,paddingLeft:20,fontSize:'0.82rem',color:'var(--gray-600)',lineHeight:1.7}}>
                <li>Log in op <strong>magister.net</strong></li>
                <li>Ga naar <strong>Instellingen</strong></li>
                <li>Zoek naar <strong>&quot;Agenda delen&quot;</strong></li>
                <li>Genereer een link en kopieer deze</li>
              </ol>
            </details>
            <details style={{marginBottom:10}}>
              <summary style={{fontWeight:600,fontSize:'0.84rem',color:'var(--gray-700)',cursor:'pointer',marginBottom:6}}>🟢 Google Kalender</summary>
              <ol style={{margin:0,paddingLeft:20,fontSize:'0.82rem',color:'var(--gray-600)',lineHeight:1.7}}>
                <li>Open <strong>calendar.google.com</strong> op je computer (niet de app)</li>
                <li>Hover over de kalender in de linkerzijbalk</li>
                <li>Klik op de drie puntjes → <strong>&quot;Instellingen en delen&quot;</strong></li>
                <li>Scroll naar <strong>&quot;Agenda integreren&quot;</strong></li>
                <li>Kopieer de link bij <strong>&quot;Geheim adres in iCal-indeling&quot;</strong></li>
              </ol>
              <div style={{fontSize:'0.76rem',color:'#92400E',background:'#FEF3C7',borderRadius:8,padding:'6px 10px',marginTop:4}}>⚠️ Gebruik NIET het openbare adres</div>
            </details>
            <details style={{marginBottom:10}}>
              <summary style={{fontWeight:600,fontSize:'0.84rem',color:'var(--gray-700)',cursor:'pointer',marginBottom:6}}>🍎 Apple iCloud Kalender</summary>
              <ol style={{margin:0,paddingLeft:20,fontSize:'0.82rem',color:'var(--gray-600)',lineHeight:1.7}}>
                <li>Open <strong>icloud.com/calendar</strong> en log in</li>
                <li>Klik op het deelicoon (wifi-symbool) naast de kalender</li>
                <li>Vink <strong>&quot;Openbare agenda&quot;</strong> aan</li>
                <li>Kopieer de link die verschijnt</li>
              </ol>
            </details>
            <details>
              <summary style={{fontWeight:600,fontSize:'0.84rem',color:'var(--gray-700)',cursor:'pointer',marginBottom:6}}>📧 Outlook</summary>
              <ol style={{margin:0,paddingLeft:20,fontSize:'0.82rem',color:'var(--gray-600)',lineHeight:1.7}}>
                <li>Open <strong>outlook.live.com</strong> en ga naar de Agenda</li>
                <li>Klik rechtsboven op het tandwiel → <strong>&quot;Alle Outlook-instellingen weergeven&quot;</strong></li>
                <li>Ga naar Agenda → <strong>&quot;Gedeelde agenda{"'"}s&quot;</strong></li>
                <li>Zoek <strong>&quot;Een agenda publiceren&quot;</strong>, kies je agenda</li>
                <li>Selecteer <strong>&quot;Kan alle details weergeven&quot;</strong> en klik op <strong>&quot;Publiceren&quot;</strong></li>
                <li>Kopieer de <strong>ICS-link</strong> die verschijnt</li>
              </ol>
            </details>
          </div>
          {magisterIcsUrl && (
            <div style={{background:'#D1FAE5',borderRadius:'var(--radius)',padding:'10px 14px',marginBottom:12,fontSize:'0.82rem',color:'#065F46',display:'flex',alignItems:'center',gap:8}}>
              <span>Gekoppeld</span>
              {magisterIcsLastSync && <span style={{color:'#047857',fontSize:'0.76rem'}}>— Laatst gesynchroniseerd: {magisterIcsLastSync}</span>}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Magister ICS-link</label>
            <input type="url" className="form-input" placeholder="https://school.magister.net/api/personen/.../icalendar/..." defaultValue={magisterIcsUrl}
              id="magister-ics-input" />
          </div>
          {magisterIcsError && <div style={{color:'#EF4444',fontSize:'0.82rem',marginBottom:12}}>{magisterIcsError}</div>}
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-primary" style={{flex:1,justifyContent:'center'}} disabled={magisterIcsLoading}
              onClick={() => {
                const input = document.getElementById('magister-ics-input');
                if (input) importMagisterICS(input.value);
              }}>
              {magisterIcsLoading ? 'Importeren...' : magisterIcsUrl ? 'Opnieuw synchroniseren' : 'Importeren'}
            </button>
            {magisterIcsUrl && (
              <button className="btn btn-outline" style={{color:'#EF4444',borderColor:'#FCA5A5'}} onClick={() => {
                setMagisterIcsUrl('');
                setMagisterIcsLastSync('');
                localStorage.removeItem('sp_magister_ics_url');
                localStorage.removeItem('sp_magister_ics_last_sync');
                setModal(null);
              }}>Ontkoppelen</button>
            )}
          </div>
        </div>
      );
    }

    if (!body) return null;

    return (
      <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
        <div className="modal">
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close" onClick={() => setModal(null)}>{icons.x}</button>
          </div>
          <div className="modal-body">{body}</div>
        </div>
      </div>
    );
  }

  // ============================================================
  // LOGIN SCREEN
  // ============================================================
  if (!isLoggedIn) {
    return (
      <div className="login-screen" style={{display:'flex'}}>
        <div className="login-container">
          <div className="login-left">
            <div className="login-brand">{icons.graduationCap}<h1>SchoolPlanner</h1></div>
            <p className="login-tagline">Organiseer je schoolleven op een slimme manier. Rooster, huiswerk, toetsen en cijfers &mdash; alles op een plek.</p>
            <div className="login-features">
              <div className="login-feature"><span className="login-feature-icon">📚</span><div><strong>Alles-in-een</strong><br/>Rooster, huiswerk, toetsen en cijfers</div></div>
              <div className="login-feature"><span className="login-feature-icon">🔗</span><div><strong>Koppelingen</strong><br/>Magister, Google Calendar, Apple &amp; meer</div></div>
              <div className="login-feature"><span className="login-feature-icon">🔥</span><div><strong>Motivatie</strong><br/>Streak teller en voortgang bijhouden</div></div>
            </div>
          </div>
          <div className="login-right">
            <div className="login-card">
              <h2>Inloggen</h2>
              <p className="login-subtitle">Log in met je SchoolPlanner account</p>
              <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
                <div className="form-group"><label className="form-label">E-mailadres</label>
                  <input type="email" className="form-input" placeholder="naam@school.nl" required /></div>
                <div className="form-group"><label className="form-label">Wachtwoord</label>
                  <input type="password" className="form-input" placeholder="Je wachtwoord..." required /></div>
                <div className="login-options">
                  <label className="login-remember"><input type="checkbox" defaultChecked /> Onthoud mij</label>
                  <a href="#" className="login-forgot" onClick={e => e.preventDefault()}>Wachtwoord vergeten?</a>
                </div>
                <button type="submit" className="btn btn-primary login-btn">Inloggen</button>
              </form>
              <div className="login-divider"><span>of</span></div>
              <button className="btn btn-outline login-btn" onClick={() => setIsLoggedIn(true)} style={{justifyContent:'center'}}>Inloggen met Magister</button>
              <div className="login-footer">
                <p>Nog geen account? <a href="#" onClick={(e) => { e.preventDefault(); setIsLoggedIn(true); }}><strong>Registreer je school</strong></a></p>
                <div className="login-plans">
                  <span className="login-plan-badge free">Gratis</span>
                  <span className="login-plan-badge pro">Pro</span>
                  <span className="login-plan-badge school">School</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE RENDERERS
  // ============================================================

  // --- NAVBAR ---
  const routes = {
    dashboard: { title: 'Dashboard', icon: 'home' },
    rooster: { title: 'Rooster', icon: 'calendar' },
    huiswerk: { title: 'Huiswerk', icon: 'book' },
    toetsen: { title: 'Toetsen', icon: 'fileText' },
    agenda: { title: 'Agenda', icon: 'clipboard' },
    cijfers: { title: 'Cijfers', icon: 'barChart' },
    examens: { title: 'Examens', icon: 'graduationCap' },
    notities: { title: 'Notities', icon: 'notepad' },
    pomodoro: { title: 'Timer', icon: 'timer' },
  };

  const MagisterBtn = ({ source }) => (
    <button className={`btn ${magistarConnected ? 'btn-magister-connected' : 'btn-magister'} btn-sm`} onClick={() => openMagisterModal(source)}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      {magistarConnected ? 'Magister gekoppeld' : 'Koppel Magister'}
    </button>
  );

  // --- DASHBOARD ---
  const hidden = settings.hiddenPages || [];
  const isPageVisible = (page) => !hidden.includes(page);
  function renderDashboard() {
    let streakMessage = '';
    if (streak === 0) streakMessage = 'Begin je streak door een taak af te vinken!';
    else if (streak < 3) streakMessage = 'Goed begin! Blijf zo doorgaan!';
    else if (streak < 7) streakMessage = 'Je bent op dreef! Fantastisch!';
    else if (streak < 14) streakMessage = 'Wat een doorzetter! Indrukwekkend!';
    else streakMessage = 'Ongelooflijk! Je bent een machine!';

    return (
      <div className="page-content">
        <div className={`streak-banner ${streak > 0 ? 'active' : ''}`}>
          <div className="streak-banner-left">
            <div className="streak-fire">{streak > 0 ? <span className="streak-fire-icon streak-pulse">🔥</span> : <span className="streak-fire-icon dim">🔥</span>}</div>
            <div className="streak-banner-info">
              <div className="streak-banner-count">{streak} dag{streak !== 1 ? 'en' : ''} streak</div>
              <div className="streak-banner-msg">{streakMessage}</div>
            </div>
          </div>
          <div className="streak-banner-right">
            <div className="streak-days">
              {['Ma','Di','Wo','Do','Vr','Za','Zo'].map((d, i) => {
                const dayNum = i + 1;
                const currentDay = today.getDay() === 0 ? 7 : today.getDay();
                const isActive = dayNum <= currentDay && dayNum > currentDay - streak;
                return <div key={d} className={`streak-day-dot ${isActive ? 'active' : ''}`}>{d}</div>;
              })}
            </div>
          </div>
        </div>

        <div className="progress-overview">
          <div className="progress-overview-item">
            <div className="progress-overview-ring"><CircularProgress percentage={progressPct} size={80} strokeWidth={7} hideLabel /></div>
            <div className="progress-overview-info"><div className="progress-overview-label">Taken</div><div className="progress-overview-value">{doneTodos}/{todos.length}</div></div>
          </div>
          {isPageVisible('huiswerk') && <><div className="progress-overview-divider"></div>
          <div className="progress-overview-item">
            <div className="progress-overview-ring"><CircularProgress percentage={hwPct} size={80} strokeWidth={7} hideLabel /></div>
            <div className="progress-overview-info"><div className="progress-overview-label">Huiswerk</div><div className="progress-overview-value">{doneHw}/{homework.length}</div></div>
          </div></>}
          {isPageVisible('toetsen') && <><div className="progress-overview-divider"></div>
          <div className="progress-overview-item">
            <div className="progress-overview-stat"><div className="progress-overview-big">{weekTests.length}</div></div>
            <div className="progress-overview-info"><div className="progress-overview-label">Toetsen</div><div className="progress-overview-value">deze week</div></div>
          </div></>}
          {isPageVisible('rooster') && <><div className="progress-overview-divider"></div>
          <div className="progress-overview-item">
            <div className="progress-overview-stat"><div className="progress-overview-big">{todaySchedule.length}</div></div>
            <div className="progress-overview-info"><div className="progress-overview-label">Lessen</div><div className="progress-overview-value">vandaag</div></div>
          </div></>}
        </div>

        <div className="welcome-block">
          <div className="welcome-text"><h1>{getGreeting()}, {firstName}</h1><p>Vandaag heb je {isPageVisible('rooster') ? `${todaySchedule.length} lessen` : ''}{isPageVisible('rooster') && isPageVisible('huiswerk') ? ' en ' : ''}{isPageVisible('huiswerk') ? `${todayHw.length} deadline${todayHw.length !== 1 ? 's' : ''}` : ''}</p></div>
          <div className="welcome-actions">
            {isPageVisible('rooster') && <button className="btn btn-primary" onClick={() => navigate('rooster')}><Icon name="calendar" size={16} /> Bekijk rooster</button>}
            {isPageVisible('huiswerk') && <button className="btn btn-secondary" onClick={() => navigate('huiswerk')}><Icon name="plus" size={16} /> Huiswerk toevoegen</button>}
          </div>
        </div>

        <div className="dashboard-layout">
          <div className="dashboard-main">
            <div className="dashboard-col">
              {isPageVisible('rooster') && <div className="card">
                <div className="card-header"><div className="card-title"><Icon name="clock" /> Vandaag</div><span className="card-action" onClick={() => navigate('rooster')}>Volledig rooster →</span></div>
                {todaySchedule.length > 0 ? <>
                  {todaySchedule.slice(0, 5).map((l, i) => {
                    const s = subjects[l.subject];
                    const name = s ? s.name : (l._customName || l.subject);
                    const teacher = s ? s.teacher : (l._teacher || '');
                    const color = s ? s.color : 'var(--gray-400)';
                    return <div key={i} className="schedule-item"><span className="schedule-time">{l.hour === 0 ? 'Hele dag' : l.time}</span><span className="schedule-dot" style={{background:color}}></span><div className="schedule-info"><div className="schedule-subject">{name}</div><div className="schedule-detail">{teacher}</div></div><span className="schedule-room">{l.room}</span></div>;
                  })}
                  {todaySchedule.length > 5 && <div style={{textAlign:'center',padding:'6px 0',fontSize:'0.78rem',color:'var(--gray-400)',cursor:'pointer'}} onClick={() => navigate('rooster')}>+{todaySchedule.length - 5} meer →</div>}
                </> : <div className="empty-state empty-state-compact"><p>Geen lessen vandaag!</p></div>}
              </div>}
            </div>
            <div className="dashboard-col">
              {isPageVisible('huiswerk') && <div className="card">
                <div className="card-header"><div className="card-title"><Icon name="clipboard" /> Vandaag inleveren</div><span className="card-action" onClick={() => navigate('huiswerk')}>Alle huiswerk →</span></div>
                {todayHw.length > 0 ? todayHw.map(h => {
                  const s = subjects[h.subject];
                  return <div key={h.id} className="todo-item" onClick={() => { setHomework(hw => hw.map(x => x.id === h.id ? {...x, done: !x.done} : x)); updateStreak(); }}>
                    <div className={`todo-checkbox ${h.done?'checked':''}`}>{icons.check}</div>
                    <div style={{flex:1}}><div className={`todo-text ${h.done?'done':''}`}>{h.title}</div><div style={{fontSize:'0.75rem',color:'var(--gray-400)',marginTop:2}}>{s.name}</div></div>
                    <span className="todo-due urgent">Vandaag</span></div>;
                }) : <div className="empty-state empty-state-compact"><p>Niets in te leveren vandaag!</p></div>}
              </div>}
              <div className="card">
                <div className="card-header"><div className="card-title"><Icon name="listChecks" /> Nog te doen</div><span style={{fontSize:'0.8rem',color:'var(--gray-400)'}}>{doneTodos}/{todos.length}</span></div>
                <div>{todos.map(t => (
                  <div key={t.id} className="todo-item" onClick={() => { setTodos(ts => ts.map(x => x.id === t.id ? {...x, done: !x.done} : x)); if (!t.done) updateStreak(); }}>
                    <div className={`todo-checkbox ${t.done?'checked':''}`}>{icons.check}</div>
                    <span className={`todo-text ${t.done?'done':''}`}>{t.text}</span>
                  </div>
                ))}</div>
                <div className="add-input-row">
                  <input type="text" placeholder="Nieuwe taak toevoegen..." value={newTodoText} onChange={e => setNewTodoText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && newTodoText.trim()) { setTodos(ts => [...ts, { id: Math.max(0,...ts.map(t=>t.id))+1, text: newTodoText.trim(), done: false }]); setNewTodoText(''); }}} />
                  <button className="btn btn-primary btn-sm" onClick={() => { if (newTodoText.trim()) { setTodos(ts => [...ts, { id: Math.max(0,...ts.map(t=>t.id))+1, text: newTodoText.trim(), done: false }]); setNewTodoText(''); }}}><Icon name="plus" size={14} /></button>
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard-sidebar">
            {isPageVisible('toetsen') && <div className="card">
              <div className="card-header"><div className="card-title"><Icon name="fileText" /> Toetsen deze week</div><span className="card-action" onClick={() => navigate('toetsen')}>Alle toetsen →</span></div>
              {weekTests.length > 0 ? weekTests.map(t => {
                const s = subjects[t.subject]; const due = getDueText(new Date(t.date));
                return <div key={t.id} className="schedule-item"><span className="schedule-dot" style={{background:s.color}}></span><div className="schedule-info"><div className="schedule-subject">{s.name}</div><div className="schedule-detail">{t.title}</div></div><span className={`todo-due ${due.urgent ? 'urgent' : ''}`}>{due.text}</span></div>;
              }) : <div className="empty-state empty-state-compact"><p>Geen toetsen deze week!</p></div>}
            </div>}
            {isPageVisible('agenda') && <div className="card">
              <div className="card-header"><div className="card-title"><Icon name="calendar" /> Kalender</div><span className="card-action" onClick={() => navigate('agenda')}>Agenda →</span></div>
              <div className="mini-calendar-container">{renderMiniCalendar(miniCalYear, miniCalMonth)}</div>
            </div>}
          </div>
        </div>
      </div>
    );
  }

  // --- ROOSTER ---
  function renderRooster() {
    return (
      <div className="page-content">
        <div className="page-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div><h1>Rooster</h1><p>Weekoverzicht — {formatDate(today)}</p></div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({type:'addLesson'})}><Icon name="plus" size={14} /> Les toevoegen</button>
            <button className="btn btn-outline btn-sm" onClick={() => { setWizardDay(0); setWizardSchedule({ maandag: [], dinsdag: [], woensdag: [], donderdag: [], vrijdag: [] }); setModal({type:'roosterWizard'}); }}><Icon name="clipboard" size={14} /> Rooster maken</button>
            <button className="btn btn-outline btn-sm" onClick={() => setModal({type:'magisterIcs'})}><Icon name="calendar" size={14} /> Magister ICS</button>
            {magisterIcsLastSync && <span style={{fontSize:'0.72rem',color:'var(--gray-400)'}}>Laatst gesynchroniseerd: {magisterIcsLastSync}</span>}
          </div>
        </div>
        <div className="day-tabs">{dayLabels.map((d,i) => <button key={d} className={`day-tab ${i===activeDayTab?'active':''}`} onClick={() => setActiveDayTab(i)}>{d}</button>)}</div>
        <div className="rooster-week">
          {dayNames.map((day, i) => {
            const lessons = schedule[day] || [];
            const isToday = i === activeDayTab;
            const dayHourTimes = getHourTimes(day);
            return (
              <div key={day} className={`rooster-day ${isToday ? 'active-day' : ''}`}>
                <div className={`rooster-day-header ${i === ((today.getDay()+6)%7) ? 'today' : ''}`}>{dayLabels[i]}</div>
                <div className="rooster-lessons">
                  {lessons.map((l, li) => {
                    const s = subjects[l.subject];
                    const displayName = s ? s.name : (l._customName || l.subject);
                    const displayTeacher = s ? s.teacher : (l._teacher || '');
                    return (
                      <div key={li} className="lesson-block" style={{background: l.hour === 0 ? '#F0FDF4' : '#fff',border: l.hour === 0 ? '1.5px solid #059669' : '1.5px solid #0A3622',borderLeft: l.hour === 0 ? '3px solid #059669' : '3px solid #0A3622'}}>
                        <div className="lesson-hour">{l.hour === 0 ? 'Hele dag' : `${l.hour}e uur · ${dayHourTimes[l.hour] || l.time}`}</div>
                        <div className="lesson-subject" style={{color: l.hour === 0 ? '#059669' : '#0A3622'}}>{displayName}</div>
                        <div className="lesson-detail">{displayTeacher}{displayTeacher && l.room ? ' · ' : ''}{l.room}</div>
                        <div className="lesson-actions">
                          <button className="lesson-action-btn" onClick={(e) => { e.stopPropagation(); setModal({type:'editLesson',day,index:li}); }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                          </button>
                          <button className="lesson-action-btn delete" onClick={(e) => { e.stopPropagation(); setSchedule(s => ({...s, [day]: s[day].filter((_,idx) => idx !== li)})); }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {lessons.length === 0 && <div className="empty-state" style={{padding:'20px 0'}}><p>Vrij</p></div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- HUISWERK ---
  function renderHuiswerk() {
    const filtered = homework.filter(h => {
      if (hwFilter === 'vandaag') return new Date(h.due).toDateString() === today.toDateString();
      if (hwFilter === 'week') { const diff = (new Date(h.due) - today) / 86400000; return diff >= 0 && diff <= 7; }
      return true;
    }).sort((a, b) => new Date(a.due) - new Date(b.due));

    return (
      <div className="page-content">
        <div className="page-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div><h1>Huiswerk</h1><p>{homework.filter(h => !h.done).length} taken open</p></div>
          <button className="btn btn-primary" onClick={() => setModal({type:'addHomework'})}><Icon name="plus" size={16} /> Toevoegen</button>
        </div>
        <div className="hw-filters">
          {['alles','vandaag','week'].map(f => <button key={f} className={`btn btn-outline btn-sm ${hwFilter===f?'active':''}`} onClick={() => setHwFilter(f)}>{f === 'week' ? 'Deze week' : f.charAt(0).toUpperCase()+f.slice(1)}</button>)}
        </div>
        <div className="hw-list">
          {filtered.length > 0 ? filtered.map((h, idx) => {
            const s = subjects[h.subject]; const due = getDueText(new Date(h.due));
            return (
              <div key={h.id} className={`hw-item ${h.done?'done':''}`} style={{background:'#fff',border:'3px solid #0C2340',borderRadius:'var(--radius)',position:'relative'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,flex:1,cursor:'pointer'}} onClick={() => { setHomework(hw => hw.map(x => x.id === h.id ? {...x, done: !x.done} : x)); if (!h.done) updateStreak(); }}>
                  <div className={`todo-checkbox ${h.done?'checked':''}`} style={{borderColor:'#0C2340'}}>{icons.check}</div>
                  {s && <span className="hw-subject-badge" style={{background:'#0C2340',color:'#fff'}}>{s.name}</span>}
                  <div className="hw-info"><div className="hw-title" style={{color:'var(--gray-800)'}}>{h.title}</div><div className={`hw-due ${due.urgent?'urgent':''}`} style={{color: due.urgent ? '#EF4444' : 'var(--gray-500)'}}>{due.text}</div></div>
                </div>
                <div style={{display:'flex',gap:4,alignItems:'center',marginLeft:8}}>
                  <button className="lesson-action-btn" onClick={(e) => { e.stopPropagation(); setModal({type:'editHomework',id:h.id}); }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                  <button className="lesson-action-btn delete" onClick={(e) => { e.stopPropagation(); setHomework(hw => hw.filter(x => x.id !== h.id)); }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
                </div>
              </div>
            );
          }) : <div className="empty-state"><p>Geen huiswerk gevonden voor dit filter</p></div>}
        </div>
      </div>
    );
  }

  // --- TOETSEN ---
  function renderToetsen() {
    const sorted = [...tests].sort((a,b) => new Date(a.date) - new Date(b.date));
    return (
      <div className="page-content">
        <div className="page-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div><h1>Toetsen</h1><p>{tests.length} aankomende toetsen</p></div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({type:'addTest'})}><Icon name="plus" size={14} /> Toets toevoegen</button>
            <MagisterBtn source="toetsen" />
          </div>
        </div>
        <div className="tests-list">
          {sorted.map(t => {
            const s = subjects[t.subject]; const daysLeft = Math.max(0, Math.round((new Date(t.date) - today) / 86400000));
            let badgeBg, badgeText;
            if (daysLeft <= 2) { badgeBg = '#FEE2E2'; badgeText = '#991B1B'; }
            else if (daysLeft <= 5) { badgeBg = '#FEF3C7'; badgeText = '#92400E'; }
            else { badgeBg = '#DCFCE7'; badgeText = '#166534'; }
            return (
              <div key={t.id} className="test-card" style={{background:'#fff',border:'1.5px solid #0A3622',borderTop:'3px solid #0A3622'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                  <div className="test-subject" style={{color:'#0A3622'}}>{s?.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span className="test-days-badge" style={{background:badgeBg,color:badgeText}}>{daysLeft === 0 ? 'Vandaag!' : `Nog ${daysLeft} dag${daysLeft!==1?'en':''}`}</span>
                    <button className="lesson-action-btn" onClick={() => setModal({type:'editTest',id:t.id})}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                    <button className="lesson-action-btn delete" onClick={() => setTests(ts => ts.filter(x => x.id !== t.id))}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
                  </div>
                </div>
                <div className="test-title">{t.title}</div>
                <div className="test-meta"><span className="test-meta-item"><Icon name="calendar" size={14} /> {formatDate(new Date(t.date))}</span><span className="test-meta-item"><Icon name="book" size={14} /> {t.chapter}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- AGENDA ---
  function renderAgenda() {
    const monthNames = ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'];
    const dayNamesShort = ['Ma','Di','Wo','Do','Vr','Za','Zo'];
    const firstDay = new Date(agendaYear, agendaMonth, 1);
    let startDay = firstDay.getDay() - 1; if (startDay < 0) startDay = 6;
    const daysInMonth = new Date(agendaYear, agendaMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(agendaYear, agendaMonth, 0).getDate();

    const eventMap = {};
    events.forEach(e => { const k = new Date(e.date).toDateString(); if (!eventMap[k]) eventMap[k] = []; eventMap[k].push(e); });
    const selectedKey = agendaSelectedDate.toDateString();
    const selectedEvents = eventMap[selectedKey] || [];

    const cells = [];
    for (let i = startDay - 1; i >= 0; i--) cells.push({ day: daysInPrevMonth - i, other: true });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(agendaYear, agendaMonth, d);
      cells.push({ day: d, other: false, isToday: date.toDateString() === today.toDateString(), isSelected: date.toDateString() === selectedKey, events: eventMap[date.toDateString()] || [] });
    }
    const total = startDay + daysInMonth;
    const remaining = (7 - (total % 7)) % 7;
    for (let d = 1; d <= remaining; d++) cells.push({ day: d, other: true });

    const connectedIcsCals = Object.entries(icsUrls);

    return (
      <div className="page-content">
        <div className="page-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div><h1>Agenda</h1><p>{formatDate(agendaSelectedDate)}</p></div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({type:'addEvent'})}><Icon name="plus" size={14} /> Event toevoegen</button>
            <button className="btn btn-outline btn-sm" onClick={openCalendarConnectModal}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Kalender koppelen {connectedIcsCals.length > 0 ? `(${connectedIcsCals.length})` : ''}
            </button>
          </div>
        </div>
        {connectedIcsCals.length > 0 && (
          <div className="connected-calendars-bar">
            {connectedIcsCals.map(([key, info]) => <span key={key} className="connected-cal-badge" style={{background:'#E0E7FF',color:'#3730A3'}}>📅 {info.name}</span>)}
          </div>
        )}
        <div className="agenda-layout">
          <div className="card">
            <div className="calendar-full-header">
              <h2>{monthNames[agendaMonth]} {agendaYear}</h2>
              <div className="calendar-full-nav">
                <button onClick={() => { let m=agendaMonth-1,y=agendaYear; if(m<0){m=11;y--;} setAgendaMonth(m); setAgendaYear(y); }}>{icons.chevronLeft}</button>
                <button onClick={() => { let m=agendaMonth+1,y=agendaYear; if(m>11){m=0;y++;} setAgendaMonth(m); setAgendaYear(y); }}>{icons.chevronRight}</button>
              </div>
            </div>
            <div className="calendar-full-grid">
              {dayNamesShort.map(d => <div key={d} className="calendar-full-day-name">{d}</div>)}
              {cells.map((c, i) => (
                <div key={i} className={`calendar-full-day${c.other ? ' other-month' : ''}${c.isToday ? ' today' : ''}${c.isSelected ? ' selected' : ''}`}
                  onClick={() => { if (!c.other) { setAgendaSelectedDate(new Date(agendaYear, agendaMonth, c.day)); }}}>
                  {c.day}
                  {c.events && c.events.length > 0 && <div className="calendar-event-dots">{c.events.slice(0,3).map((e,j) => { const col = eventTypeColors[e.type]; return <span key={j} className="calendar-event-dot" style={{background: col?.text || '#6B7280'}}></span>; })}</div>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="card">
              <div className="card-header"><div className="card-title"><Icon name="calendar" /> {agendaSelectedDate.toDateString() === today.toDateString() ? 'Vandaag' : formatDate(agendaSelectedDate)}</div></div>
              {selectedEvents.length > 0 ? selectedEvents.map(e => {
                const typeInfo = eventTypeColors[e.type] || { bg: '#F3F4F6', text: '#374151', label: 'Overig' };
                return (
                  <div key={e.id} className="event-item">
                    <span className="event-time">{e.time}</span>
                    <div className="event-info"><div className="event-title">{e.title}</div><span className="event-type-badge" style={{background:typeInfo.bg,color:typeInfo.text}}>{typeInfo.label}</span></div>
                    <div className="event-actions">
                      <button className="lesson-action-btn" onClick={() => setModal({type:'editEvent',id:e.id})}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                      <button className="lesson-action-btn delete" onClick={() => setEvents(evs => evs.filter(x => x.id !== e.id))}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
                    </div>
                  </div>
                );
              }) : <div className="empty-state"><p>Geen events op deze dag</p></div>}
            </div>
            <div className="card" style={{marginTop:16}}>
              <div className="card-header"><div className="card-title"><Icon name="clock" /> Binnenkort</div></div>
              {events.filter(e => new Date(e.date) >= today).slice(0, 5).map(e => {
                const typeInfo = eventTypeColors[e.type] || { bg: '#F3F4F6', text: '#374151', label: 'Overig' };
                const due = getDueText(new Date(e.date));
                return (
                  <div key={e.id} className="event-item" style={{cursor:'pointer'}} onClick={() => { const d = new Date(e.date); setAgendaSelectedDate(d); setAgendaYear(d.getFullYear()); setAgendaMonth(d.getMonth()); }}>
                    <span className="event-time">{due.text}</span>
                    <div className="event-info"><div className="event-title">{e.title}</div><span className="event-type-badge" style={{background:typeInfo.bg,color:typeInfo.text}}>{typeInfo.label}</span></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- CIJFERS ---
  function renderCijfers() {
    const allGrades = Object.values(grades).flatMap(s => s.grades || []);
    const allValues = allGrades.map(g => typeof g === 'object' ? g.value : g);
    const highest = allValues.length > 0 ? Math.max(...allValues).toFixed(1) : '0.0';
    const voldoende = allValues.filter(v => v >= 5.5).length;

    // Per-subject detail view
    if (cijfersView !== 'overzicht' && cijfersView !== 'jaaroverzicht' && subjects[cijfersView]) {
      const subjectId = cijfersView;
      const s = subjects[subjectId];
      const data = grades[subjectId] || { grades: [] };
      const avg = getAverage(data.grades);
      const avgNum = parseFloat(avg);
      const subjectValues = data.grades.map(g => typeof g === 'object' ? g.value : g);
      const subjectHighest = subjectValues.length > 0 ? Math.max(...subjectValues).toFixed(1) : '-';
      const subjectLowest = subjectValues.length > 0 ? Math.min(...subjectValues).toFixed(1) : '-';
      const totalWeight = data.grades.reduce((s, g) => s + (g.weight || 1), 0);

      return (
        <div className="page-content">
          <div className="page-header">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
              <div>
                <button className="btn btn-outline btn-sm" style={{marginBottom:8}} onClick={() => setCijfersView('overzicht')}>← Terug naar overzicht</button>
                <h1 style={{display:'flex',alignItems:'center',gap:10}}><span style={{width:12,height:12,borderRadius:3,background:s.color,display:'inline-block'}}></span>{s.name}</h1>
                <p>{s.teacher}</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setModal({type:'addGrade',subject:subjectId})}>+ Cijfer toevoegen</button>
            </div>
          </div>
          <div className="grades-overview">
            <div className="grade-stat-card"><div className="grade-stat-value" style={{color: avgNum >= 5.5 ? '#059669' : '#EF4444'}}>{avg}</div><div className="grade-stat-label">Gemiddeld</div></div>
            <div className="grade-stat-card"><div className="grade-stat-value">{subjectHighest}</div><div className="grade-stat-label">Hoogste</div></div>
            <div className="grade-stat-card"><div className="grade-stat-value">{subjectLowest}</div><div className="grade-stat-label">Laagste</div></div>
            <div className="grade-stat-card"><div className="grade-stat-value">{data.grades.length}</div><div className="grade-stat-label">Cijfers</div></div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Alle cijfers</div></div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.85rem'}}>
                <thead>
                  <tr style={{borderBottom:'2px solid var(--gray-100)'}}>
                    <th style={{textAlign:'left',padding:'10px 12px',color:'var(--gray-500)',fontWeight:600,fontSize:'0.78rem',textTransform:'uppercase',letterSpacing:'0.04em'}}>Omschrijving</th>
                    <th style={{textAlign:'center',padding:'10px 12px',color:'var(--gray-500)',fontWeight:600,fontSize:'0.78rem',textTransform:'uppercase',letterSpacing:'0.04em'}}>Cijfer</th>
                    <th style={{textAlign:'center',padding:'10px 12px',color:'var(--gray-500)',fontWeight:600,fontSize:'0.78rem',textTransform:'uppercase',letterSpacing:'0.04em'}}>Weging</th>
                    <th style={{textAlign:'center',padding:'10px 12px',color:'var(--gray-500)',fontWeight:600,fontSize:'0.78rem',textTransform:'uppercase',letterSpacing:'0.04em'}}>Datum</th>
                    <th style={{textAlign:'center',padding:'10px 12px',width:40}}></th>
                  </tr>
                </thead>
                <tbody>
                  {data.grades.map((g, i) => {
                    const val = typeof g === 'object' ? g.value : g;
                    const gClass = val >= 7 ? 'grade-good' : val >= 5.5 ? 'grade-ok' : 'grade-bad';
                    const desc = typeof g === 'object' ? g.description : (data.descriptions?.[i] || '');
                    const weight = typeof g === 'object' ? g.weight : 1;
                    const date = typeof g === 'object' ? g.date : '';
                    return (
                      <tr key={i} style={{borderBottom:'1px solid var(--gray-50)',cursor:'pointer'}} onClick={() => setModal({type:'editGrade',subjectId,gradeIndex:i})}>
                        <td style={{padding:'12px',color:'var(--gray-700)'}}>{desc}</td>
                        <td style={{padding:'12px',textAlign:'center'}}><span className={`grade-value ${gClass}`}>{val.toFixed(1)}</span></td>
                        <td style={{padding:'12px',textAlign:'center',color:'var(--gray-500)'}}>{weight}x</td>
                        <td style={{padding:'12px',textAlign:'center',color:'var(--gray-400)',fontSize:'0.8rem'}}>{date ? new Date(date).toLocaleDateString('nl-NL',{day:'numeric',month:'short'}) : '-'}</td>
                        <td style={{padding:'12px',textAlign:'center'}}>
                          <button className="lesson-action-btn" onClick={(e) => { e.stopPropagation(); setModal({type:'editGrade',subjectId,gradeIndex:i}); }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {data.grades.length > 0 && (
              <div style={{padding:'14px 12px',borderTop:'1px solid var(--gray-100)',display:'flex',justifyContent:'space-between',fontSize:'0.82rem',color:'var(--gray-500)'}}>
                <span>Totale weging: {totalWeight.toFixed(2)}x</span>
                <span>Gewogen gemiddelde: <strong style={{color:'var(--gray-800)'}}>{avg}</strong></span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Yearly overview
    if (cijfersView === 'jaaroverzicht') {
      const months = ['Jan','Feb','Mrt','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec'];
      return (
        <div className="page-content">
          <div className="page-header">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
              <div>
                <button className="btn btn-outline btn-sm" style={{marginBottom:8}} onClick={() => setCijfersView('overzicht')}>← Terug naar overzicht</button>
                <h1>Jaaroverzicht</h1>
                <p>Alle cijfers per vak en per maand</p>
              </div>
            </div>
          </div>
          <div className="card" style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.8rem',minWidth:700}}>
              <thead>
                <tr style={{borderBottom:'2px solid var(--gray-100)'}}>
                  <th style={{textAlign:'left',padding:'10px 14px',color:'var(--gray-500)',fontWeight:600,fontSize:'0.76rem',position:'sticky',left:0,background:'var(--white)',zIndex:1}}>Vak</th>
                  {months.map(m => <th key={m} style={{textAlign:'center',padding:'10px 8px',color:'var(--gray-400)',fontWeight:600,fontSize:'0.7rem',textTransform:'uppercase',letterSpacing:'0.04em',minWidth:48}}>{m}</th>)}
                  <th style={{textAlign:'center',padding:'10px 14px',color:'var(--gray-700)',fontWeight:700,fontSize:'0.78rem'}}>Gem.</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(grades).map(([subjectId, data]) => {
                  const s = subjects[subjectId];
                  if (!s || !data.grades) return null;
                  const avg = getAverage(data.grades);
                  const avgNum = parseFloat(avg);
                  const avgClass = avgNum >= 7 ? 'grade-good' : avgNum >= 5.5 ? 'grade-ok' : 'grade-bad';
                  // Group grades by month
                  const byMonth = {};
                  data.grades.forEach(g => {
                    const date = typeof g === 'object' && g.date ? new Date(g.date) : null;
                    if (date) {
                      const m = date.getMonth();
                      if (!byMonth[m]) byMonth[m] = [];
                      byMonth[m].push(typeof g === 'object' ? g.value : g);
                    }
                  });
                  return (
                    <tr key={subjectId} style={{borderBottom:'1px solid var(--gray-50)',cursor:'pointer'}} onClick={() => setCijfersView(subjectId)}>
                      <td style={{padding:'10px 14px',fontWeight:600,color:'var(--gray-800)',position:'sticky',left:0,background:'var(--white)',zIndex:1}}>
                        <span style={{display:'inline-flex',alignItems:'center',gap:8}}><span style={{width:8,height:8,borderRadius:2,background:s.color,display:'inline-block'}}></span>{s.name}</span>
                      </td>
                      {months.map((_, mi) => {
                        const monthGrades = byMonth[mi];
                        if (!monthGrades) return <td key={mi} style={{textAlign:'center',padding:'10px 8px',color:'var(--gray-200)'}}>—</td>;
                        const monthAvg = (monthGrades.reduce((a,b)=>a+b,0)/monthGrades.length);
                        const cellClass = monthAvg >= 7 ? 'grade-good' : monthAvg >= 5.5 ? 'grade-ok' : 'grade-bad';
                        return <td key={mi} style={{textAlign:'center',padding:'10px 8px'}}><span className={`grade-value ${cellClass}`} style={{fontSize:'0.78rem',padding:'2px 8px'}}>{monthAvg.toFixed(1)}</span></td>;
                      })}
                      <td style={{textAlign:'center',padding:'10px 14px'}}><span className={`grade-value ${avgClass}`} style={{fontWeight:700}}>{avg}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Main overview
    return (
      <div className="page-content">
        <div className="page-header">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
            <div><h1>Cijfers</h1><p>Overzicht van al je cijfers{settings.niveau ? ` — ${settings.niveau}` : ''}</p></div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <button className="btn btn-primary btn-sm" onClick={() => setModal({type:'addGrade'})}>+ Cijfer toevoegen</button>
              <button className="btn btn-outline btn-sm" onClick={() => setCijfersView('jaaroverzicht')}>Jaaroverzicht</button>
              <MagisterBtn source="cijfers" />
            </div>
          </div>
        </div>
        <div className="grades-overview">
          <div className="grade-stat-card"><div className="grade-stat-value">{overallAvg}</div><div className="grade-stat-label">Gemiddeld</div></div>
          <div className="grade-stat-card"><div className="grade-stat-value">{highest}</div><div className="grade-stat-label">Hoogste</div></div>
          <div className="grade-stat-card"><div className="grade-stat-value">{allGrades.length}</div><div className="grade-stat-label">Cijfers</div></div>
          <div className="grade-stat-card"><div className="grade-stat-value">{allValues.length > 0 ? Math.round(voldoende/allValues.length*100) : 0}%</div><div className="grade-stat-label">Voldoende</div></div>
        </div>
        <div>
          {Object.entries(grades).map(([subjectId, data]) => {
            const s = subjects[subjectId];
            if (!s || !data.grades) return null;
            const avg = getAverage(data.grades);
            const avgNum = parseFloat(avg);
            const avgClass = avgNum >= 7 ? 'grade-good' : avgNum >= 5.5 ? 'grade-ok' : 'grade-bad';
            return (
              <div key={subjectId} className="subject-row">
                <div className="subject-row-header" onClick={() => setOpenGrades(g => ({...g, [subjectId]: !g[subjectId]}))}>
                  <div className="subject-color-bar" style={{background:s.color}}></div>
                  <div className="subject-name">{s.name}</div>
                  <div className="subject-teacher">{s.teacher}</div>
                  <div className={`subject-average ${avgClass}`} style={{padding:'2px 10px',borderRadius:6}}>{avg}</div>
                  <div className={`subject-chevron ${openGrades[subjectId]?'open':''}`}>{icons.chevronDown}</div>
                </div>
                <div className={`subject-grades ${openGrades[subjectId]?'open':''}`}>
                  {data.grades.map((g, i) => {
                    const val = typeof g === 'object' ? g.value : g;
                    const gClass = val >= 7 ? 'grade-good' : val >= 5.5 ? 'grade-ok' : 'grade-bad';
                    const desc = typeof g === 'object' ? g.description : (data.descriptions?.[i] || '');
                    const weight = typeof g === 'object' ? (g.weight || 1) : 1;
                    return (
                      <div key={i} className="grade-row" style={{cursor:'pointer'}} onClick={() => setModal({type:'editGrade',subjectId,gradeIndex:i})}>
                        <span className="grade-desc">{desc}</span>
                        <span style={{fontSize:'0.75rem',color:'var(--gray-400)',marginLeft:'auto',marginRight:12}}>{weight}x</span>
                        <span className={`grade-value ${gClass}`}>{val.toFixed(1)}</span>
                      </div>
                    );
                  })}
                  <div style={{padding:'8px 0',borderTop:'1px solid var(--gray-100)',marginTop:4}}>
                    <button className="btn btn-outline btn-sm" style={{width:'100%',justifyContent:'center'}} onClick={() => setCijfersView(subjectId)}>Uitgebreid overzicht →</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- POMODORO ---
  function renderPomodoro() {
    const minutes = Math.floor(pomodoroTime / 60);
    const seconds = pomodoroTime % 60;
    const totalTime = phaseDurations[pomodoroPhase];
    const progress = ((totalTime - pomodoroTime) / totalTime) * 100;
    const phaseColor = pomodoroPhase === 'work' ? '#EF4444' : '#10B981';

    return (
      <div className="page-content">
        <div className="page-header" style={{textAlign:'center'}}>
          <h1>{timerName} Timer</h1>
          <p>{isDefaultPomodoro ? 'Studeer effectief met de Pomodoro-techniek' : `${settings.pomodoroWork || 25} min studeren, ${settings.pomodoroBreak || 5} min pauze, ${settings.pomodoroRounds || 4} rondes`}</p>
        </div>

        <div style={{maxWidth:480,margin:'0 auto'}}>
          <div className="card" style={{textAlign:'center',padding:'40px 24px'}}>
            <div style={{fontSize:'0.85rem',fontWeight:600,color:phaseColor,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:20}}>
              {pomodoroPhaseLabel} — Ronde {pomodoroRound}/{pomRounds}
            </div>

            <div style={{position:'relative',width:220,height:220,margin:'0 auto 28px'}}>
              <svg width="220" height="220" style={{transform:'rotate(-90deg)'}}>
                <circle cx="110" cy="110" r="100" fill="none" stroke="var(--gray-100)" strokeWidth="8" />
                <circle cx="110" cy="110" r="100" fill="none" stroke={phaseColor} strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 100}`}
                  strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress / 100)}`}
                  strokeLinecap="round" style={{transition:'stroke-dashoffset 0.5s'}} />
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
                <div style={{fontSize:'3.5rem',fontWeight:800,fontFamily:'monospace',color:'var(--gray-800)',lineHeight:1}}>
                  {String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}
                </div>
              </div>
            </div>

            <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:24}}>
              <button className="btn btn-primary" style={{minWidth:120,justifyContent:'center',background:phaseColor,borderColor:phaseColor}}
                onClick={() => setPomodoroRunning(r => !r)}>
                {pomodoroRunning ? 'Pauzeer' : 'Start'}
              </button>
              <button className="btn btn-outline" style={{minWidth:100,justifyContent:'center'}} onClick={resetPomodoro}>Reset</button>
            </div>

            <div style={{display:'flex',justifyContent:'center',gap:6,marginBottom:8}}>
              {Array.from({length: pomRounds}, (_, i) => i + 1).map(r => (
                <div key={r} style={{width:12,height:12,borderRadius:'50%',background: r <= pomodoroRound && pomodoroPhase === 'work' ? phaseColor : r < pomodoroRound ? phaseColor : 'var(--gray-200)',transition:'background 0.3s'}} />
              ))}
            </div>
          </div>

          <div className="card" style={{marginTop:16,padding:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:'0.82rem',fontWeight:600,color:'var(--gray-700)'}}>Vandaag voltooid</div>
                <div style={{fontSize:'0.78rem',color:'var(--gray-400)',marginTop:2}}>{pomodoroMinutesToday} minuten gestudeerd</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:'2rem',fontWeight:800,color:'var(--accent)'}}>{pomodorosToday}</span>
                <span style={{fontSize:'0.78rem',color:'var(--gray-400)'}}>{isDefaultPomodoro ? "pomodoro's" : 'sessies'}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{marginTop:16,padding:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <div style={{fontSize:'0.85rem',fontWeight:600,color:'var(--gray-700)'}}>Instellingen</div>
              {pomodoroRunning && <span style={{fontSize:'0.75rem',color:'#EF4444',fontWeight:500}}>Pauzeer de timer om te wijzigen</span>}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,opacity:pomodoroRunning?0.5:1,pointerEvents:pomodoroRunning?'none':'auto'}}>
              <div className="form-group" style={{margin:0}}>
                <label className="form-label" style={{fontSize:'0.76rem'}}>Studietijd (min)</label>
                <input type="number" className="form-input" style={{padding:'6px 10px',fontSize:'0.82rem'}} value={settings.pomodoroWork || 25} min={1} max={120}
                  onChange={e => { const v = parseInt(e.target.value) || 25; setSettings(s => ({...s, pomodoroWork: v})); if (pomodoroPhase === 'work') setPomodoroTime(v * 60); }} />
              </div>
              <div className="form-group" style={{margin:0}}>
                <label className="form-label" style={{fontSize:'0.76rem'}}>Korte pauze (min)</label>
                <input type="number" className="form-input" style={{padding:'6px 10px',fontSize:'0.82rem'}} value={settings.pomodoroBreak || 5} min={1} max={60}
                  onChange={e => { const v = parseInt(e.target.value) || 5; setSettings(s => ({...s, pomodoroBreak: v})); if (pomodoroPhase === 'break') setPomodoroTime(v * 60); }} />
              </div>
              <div className="form-group" style={{margin:0}}>
                <label className="form-label" style={{fontSize:'0.76rem'}}>Lange pauze (min)</label>
                <input type="number" className="form-input" style={{padding:'6px 10px',fontSize:'0.82rem'}} value={settings.pomodoroLongBreak || 15} min={1} max={60}
                  onChange={e => { const v = parseInt(e.target.value) || 15; setSettings(s => ({...s, pomodoroLongBreak: v})); if (pomodoroPhase === 'longBreak') setPomodoroTime(v * 60); }} />
              </div>
              <div className="form-group" style={{margin:0}}>
                <label className="form-label" style={{fontSize:'0.76rem'}}>Rondes voor lange pauze</label>
                <input type="number" className="form-input" style={{padding:'6px 10px',fontSize:'0.82rem'}} value={settings.pomodoroRounds || 4} min={1} max={10}
                  onChange={e => { const v = parseInt(e.target.value) || 4; setSettings(s => ({...s, pomodoroRounds: v})); }} />
              </div>
            </div>
            <div style={{marginTop:14,fontSize:'0.78rem',color:'var(--gray-400)',lineHeight:1.7}}>
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:2}}><span style={{width:7,height:7,borderRadius:'50%',background:'#EF4444',flexShrink:0}}></span> {settings.pomodoroWork || 25} min studeren</div>
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:2}}><span style={{width:7,height:7,borderRadius:'50%',background:'#10B981',flexShrink:0}}></span> {settings.pomodoroBreak || 5} min korte pauze</div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}><span style={{width:7,height:7,borderRadius:'50%',background:'#06B6D4',flexShrink:0}}></span> Na {settings.pomodoroRounds || 4} rondes: {settings.pomodoroLongBreak || 15} min lange pauze</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- NOTITIES ---
  function renderNotities() {
    const mijnVakken = settings.mijnVakken || [];
    const examVakken = settings.examVakken || [];

    // editingNote = 'VakNaam' means viewing that vak's topics
    // editingNote = 'VakNaam::topicId' means editing a specific topic

    const getVakTopics = (vakName) => {
      const data = notes[vakName];
      // Migrate old format (single note) to new format (topics array)
      if (data && !data.topics) {
        return [{ id: '1', title: data.title || '', text: data.text || '', updated: data.updated || '', collapsed: false }];
      }
      return data?.topics || [];
    };

    const openVak = (vakName) => {
      setEditingNote(vakName);
      setNoteTitle('');
      setNoteText('');
    };

    const openTopic = (vakName, topicId) => {
      const topics = getVakTopics(vakName);
      const topic = topics.find(t => t.id === topicId);
      if (topic) {
        setEditingNote(`${vakName}::${topicId}`);
        setNoteTitle(topic.title);
        setNoteText(topic.text);
      }
    };

    const saveTopic = (vakName, topicId) => {
      setNotes(prev => {
        const topics = getVakTopics(vakName).map(t =>
          t.id === topicId ? { ...t, title: noteTitle, text: noteText, updated: new Date().toISOString() } : t
        );
        return { ...prev, [vakName]: { topics } };
      });
      setEditingNote(vakName); // go back to vak overview
    };

    const addTopic = (vakName) => {
      const id = Date.now().toString();
      setNotes(prev => {
        const existing = getVakTopics(vakName);
        return { ...prev, [vakName]: { topics: [...existing, { id, title: '', text: '', updated: '', collapsed: false }] } };
      });
      setEditingNote(`${vakName}::${id}`);
      setNoteTitle('');
      setNoteText('');
    };

    const deleteTopic = (vakName, topicId) => {
      setNotes(prev => {
        const topics = getVakTopics(vakName).filter(t => t.id !== topicId);
        return { ...prev, [vakName]: { topics } };
      });
    };

    const toggleTopicCollapse = (vakName, topicId) => {
      setNotes(prev => {
        const topics = getVakTopics(vakName).map(t =>
          t.id === topicId ? { ...t, collapsed: !t.collapsed } : t
        );
        return { ...prev, [vakName]: { topics } };
      });
    };

    const addVak = (vakName) => {
      if (vakName && !mijnVakken.includes(vakName)) {
        setSettings(s => ({...s, mijnVakken: [...(s.mijnVakken || []), vakName]}));
      }
    };

    const removeVak = (vakName) => {
      setSettings(s => ({...s, mijnVakken: (s.mijnVakken || []).filter(v => v !== vakName)}));
    };

    const syncFromExam = () => {
      if (examVakken.length > 0) {
        const merged = [...new Set([...mijnVakken, ...examVakken])];
        setSettings(s => ({...s, mijnVakken: merged}));
      }
    };

    const syncToExam = () => {
      if (mijnVakken.length > 0) {
        const merged = [...new Set([...examVakken, ...mijnVakken])];
        setSettings(s => ({...s, examVakken: merged}));
      }
    };

    // Editing a specific topic
    if (editingNote && editingNote.includes('::')) {
      const [vakName, topicId] = editingNote.split('::');
      const idx = mijnVakken.indexOf(vakName);
      const color = getVakColor(vakName, idx >= 0 ? idx : 0);
      return (
        <div className="page-content">
          <div className="page-header">
            <button className="btn btn-outline btn-sm" style={{marginBottom:8}} onClick={() => saveTopic(vakName, topicId)}>← Terug naar {vakName}</button>
            <h1 style={{display:'flex',alignItems:'center',gap:10}}><span style={{width:12,height:12,borderRadius:3,background:color,display:'inline-block'}}></span>{vakName}</h1>
          </div>
          <div className="card" style={{maxWidth:700}}>
            <div className="form-group">
              <label className="form-label">Onderwerp</label>
              <input type="text" className="form-input" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="Bijv. Hoofdstuk 3, Les 12, Samenvatting..." />
            </div>
            <div className="form-group">
              <label className="form-label">Notitie</label>
              <textarea className="form-input" value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Typ je notities hier..."
                style={{minHeight:300,resize:'vertical',fontFamily:'inherit',lineHeight:1.7}} />
            </div>
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={() => saveTopic(vakName, topicId)}>Opslaan</button>
          </div>
        </div>
      );
    }

    // Viewing a vak's topics
    if (editingNote && !editingNote.includes('::')) {
      const vakName = editingNote;
      const idx = mijnVakken.indexOf(vakName);
      const color = getVakColor(vakName, idx >= 0 ? idx : 0);
      const topics = getVakTopics(vakName);
      return (
        <div className="page-content">
          <div className="page-header">
            <button className="btn btn-outline btn-sm" style={{marginBottom:8}} onClick={() => setEditingNote(null)}>← Terug naar overzicht</button>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
              <h1 style={{display:'flex',alignItems:'center',gap:10}}><span style={{width:12,height:12,borderRadius:3,background:color,display:'inline-block'}}></span>{vakName}</h1>
              <div style={{display:'flex',gap:8}}>
                <button className="btn btn-outline btn-sm" onClick={() => {
                  const allCollapsed = topics.every(t => t.collapsed);
                  setNotes(prev => ({...prev, [vakName]: { topics: topics.map(t => ({...t, collapsed: !allCollapsed})) }}));
                }}>{topics.every(t => t.collapsed) ? 'Alles uitklappen' : 'Alles inklappen'}</button>
                <button className="btn btn-primary btn-sm" onClick={() => addTopic(vakName)}><Icon name="plus" size={14} /> Nieuw onderwerp</button>
              </div>
            </div>
          </div>

          {topics.length === 0 ? (
            <div className="card" style={{padding:32,textAlign:'center'}}>
              <div style={{fontSize:'0.9rem',color:'var(--gray-400)',marginBottom:16}}>Nog geen onderwerpen voor {vakName}</div>
              <button className="btn btn-primary" onClick={() => addTopic(vakName)}><Icon name="plus" size={14} /> Eerste onderwerp toevoegen</button>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {topics.map(topic => (
                <div key={topic.id} className="card" style={{padding:0,overflow:'hidden'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 18px',cursor:'pointer',background: topic.collapsed ? 'transparent' : 'var(--gray-50)'}}
                    onClick={() => toggleTopicCollapse(vakName, topic.id)}>
                    <span style={{display:'inline-flex',transform: topic.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',transition:'transform 0.2s',color:'var(--gray-400)'}}><Icon name="chevronDown" size={16} /></span>
                    <span style={{flex:1,fontWeight:600,fontSize:'0.88rem',color:'var(--gray-800)'}}>{topic.title || 'Naamloos onderwerp'}</span>
                    {topic.updated && <span style={{fontSize:'0.7rem',color:'var(--gray-300)'}}>{new Date(topic.updated).toLocaleDateString('nl-NL',{day:'numeric',month:'short'})}</span>}
                    <button className="btn btn-outline btn-sm" style={{padding:'3px 10px',fontSize:'0.72rem'}} onClick={e => { e.stopPropagation(); openTopic(vakName, topic.id); }}>Bewerken</button>
                    <span style={{cursor:'pointer',color:'var(--gray-300)',fontSize:'1.1rem',lineHeight:1,padding:'0 4px'}} onClick={e => { e.stopPropagation(); if (confirm('Dit onderwerp verwijderen?')) deleteTopic(vakName, topic.id); }} title="Verwijderen">×</span>
                  </div>
                  {!topic.collapsed && topic.text && (
                    <div style={{padding:'0 18px 14px 44px',fontSize:'0.82rem',color:'var(--gray-500)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{topic.text}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Setup screen: choose vakken
    if (mijnVakken.length === 0 || !notitiesSetupDone) {
      const alleExamVakken = [...new Set(Object.values(examVakkenPerNiveau).flat())].sort();
      const alleVakken = [...new Set([...Object.values(subjects).map(s => s.name), ...alleExamVakken])].sort();
      return (
        <div className="page-content">
          <div className="page-header"><h1>Notities</h1><p>Kies eerst je vakken om notities voor te maken</p></div>
          <div className="card" style={{maxWidth:600,padding:24}}>
            {examVakken.length > 0 && (
              <div style={{marginBottom:20}}>
                <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={() => { syncFromExam(); setNotitiesSetupDone(true); }}>
                  Gebruik mijn examenvakken ({examVakken.length} vakken)
                </button>
                <div style={{textAlign:'center',fontSize:'0.8rem',color:'var(--gray-400)',margin:'12px 0'}}>— of kies handmatig —</div>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Selecteer je vakken</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {alleVakken.map(v => {
                  const sel = mijnVakken.includes(v);
                  return <button key={v} className={`btn btn-sm ${sel ? 'btn-primary' : 'btn-outline'}`} style={{fontSize:'0.8rem'}} onClick={() => sel ? removeVak(v) : addVak(v)}>{v}</button>;
                })}
              </div>
            </div>
            <div style={{marginTop:16,display:'flex',gap:8,alignItems:'center'}}>
              <input type="text" className="form-input" value={nieuwVakNaam} onChange={e => setNieuwVakNaam(e.target.value)} placeholder="Ander vak toevoegen..." style={{flex:1}} onKeyDown={e => { if (e.key === 'Enter' && nieuwVakNaam.trim()) { addVak(nieuwVakNaam.trim()); setNieuwVakNaam(''); }}} />
              <button className="btn btn-outline btn-sm" onClick={() => { if (nieuwVakNaam.trim()) { addVak(nieuwVakNaam.trim()); setNieuwVakNaam(''); }}}>Toevoegen</button>
            </div>
            {mijnVakken.length > 0 && (
              <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:16}} onClick={() => setNotitiesSetupDone(true)}>
                Volgende ({mijnVakken.length} vakken geselecteerd)
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="page-content">
        <div className="page-header">
          <h1>Notities</h1>
          <p>Notities per vak</p>
          <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>
            <button className="btn btn-outline btn-sm" style={{fontSize:'0.76rem'}} onClick={() => setNotitiesSetupDone(false)}>Vakken wijzigen</button>
            {examVakken.length > 0 && <button className="btn btn-outline btn-sm" style={{fontSize:'0.76rem'}} onClick={syncFromExam}>Examenvakken overnemen</button>}
            {mijnVakken.length > 0 && examVakken.length > 0 && <button className="btn btn-outline btn-sm" style={{fontSize:'0.76rem'}} onClick={syncToExam}>Mijn vakken → examenvakken</button>}
          </div>
        </div>

        {/* Add/remove vakken */}
        <div className="card" style={{padding:16,marginBottom:16}}>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            <span style={{fontSize:'0.82rem',fontWeight:600,color:'var(--gray-600)'}}>Vakken:</span>
            {mijnVakken.map(v => (
              <span key={v} style={{display:'inline-flex',alignItems:'center',gap:4,background:'var(--gray-100)',borderRadius:20,padding:'4px 10px',fontSize:'0.78rem',color:'var(--gray-700)'}}>
                {v}
                <span style={{cursor:'pointer',color:'var(--gray-400)',fontWeight:700,fontSize:'0.85rem',lineHeight:1}} onClick={() => removeVak(v)}>×</span>
              </span>
            ))}
            <div style={{display:'flex',gap:4,alignItems:'center'}}>
              <input type="text" className="form-input" value={nieuwVakNaam} onChange={e => setNieuwVakNaam(e.target.value)} placeholder="Vak toevoegen..." style={{padding:'4px 10px',fontSize:'0.78rem',width:140}} onKeyDown={e => { if (e.key === 'Enter' && nieuwVakNaam.trim()) { addVak(nieuwVakNaam.trim()); setNieuwVakNaam(''); }}} />
              <button className="btn btn-outline btn-sm" style={{padding:'4px 8px',fontSize:'0.74rem'}} onClick={() => { if (nieuwVakNaam.trim()) { addVak(nieuwVakNaam.trim()); setNieuwVakNaam(''); }}}>+</button>
            </div>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',gap:16}}>
          {mijnVakken.map((vakName, idx) => {
            const topics = getVakTopics(vakName);
            const topicCount = topics.length;
            const filledTopics = topics.filter(t => t.title || t.text);
            const color = getVakColor(vakName, idx);
            const lastUpdated = topics.reduce((latest, t) => t.updated && t.updated > latest ? t.updated : latest, '');
            return (
              <div key={vakName} className="card" style={{cursor:'pointer',padding:20}} onClick={() => openVak(vakName)}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                  <span style={{width:10,height:10,borderRadius:3,background:color}}></span>
                  <span style={{fontWeight:600,fontSize:'0.92rem',color:'var(--gray-800)'}}>{vakName}</span>
                  {topicCount > 0 && <span style={{marginLeft:'auto',background:'var(--gray-100)',borderRadius:10,padding:'2px 8px',fontSize:'0.72rem',color:'var(--gray-500)',fontWeight:600}}>{topicCount}</span>}
                </div>
                {filledTopics.length > 0 ? (
                  <div>
                    {filledTopics.slice(0, 3).map(t => (
                      <div key={t.id} style={{fontSize:'0.8rem',color:'var(--gray-500)',marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {t.title || 'Naamloos onderwerp'}
                      </div>
                    ))}
                    {filledTopics.length > 3 && <div style={{fontSize:'0.75rem',color:'var(--gray-300)'}}>+{filledTopics.length - 3} meer</div>}
                    {lastUpdated && <div style={{fontSize:'0.7rem',color:'var(--gray-300)',marginTop:8}}>Bijgewerkt: {new Date(lastUpdated).toLocaleDateString('nl-NL',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>}
                  </div>
                ) : (
                  <div style={{fontSize:'0.82rem',color:'var(--gray-400)',fontStyle:'italic'}}>Nog geen onderwerpen</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- EXAMENS ---
  function renderExamens() {
    const niveau = settings.niveau;
    const gekozenVakken = settings.examVakken || [];

    // Setup screen if no niveau selected
    if (!niveau) {
      return (
        <div className="page-content">
          <div className="page-header"><h1>Examenrooster</h1><p>Stel eerst je niveau en examenvakken in</p></div>
          <div className="card" style={{maxWidth:520}}>
            <div className="card-header"><div className="card-title">{icons.graduationCap} Niveau kiezen</div></div>
            <div style={{padding:16,display:'flex',flexDirection:'column',gap:10}}>
              <p style={{color:'var(--gray-500)',fontSize:'0.85rem',margin:0}}>Selecteer je examenniveau om je persoonlijke examenrooster te zien.</p>
              {['VMBO GL/TL','HAVO','VWO'].map(n => (
                <button key={n} className="btn btn-outline" style={{justifyContent:'center',padding:'14px 20px',fontSize:'0.95rem'}} onClick={() => setSettings(s => ({...s, niveau: n, examVakken: []}))}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const beschikbareVakken = examVakkenPerNiveau[niveau] || [];

    // Setup screen if no vakken selected or in setup mode
    if (gekozenVakken.length === 0 || !examSetupDone) {
      return (
        <div className="page-content">
          <div className="page-header">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
              <div><h1>Examenrooster</h1><p>{niveau} — Kies je examenvakken</p></div>
              <button className="btn btn-outline btn-sm" onClick={() => { setExamSetupDone(false); setSettings(s => ({...s, niveau: '', examVakken: []})); }}>Niveau wijzigen</button>
            </div>
          </div>
          <div className="card" style={{maxWidth:600}}>
            <div className="card-header"><div className="card-title"><Icon name="book" /> Selecteer je examenvakken</div></div>
            <div style={{padding:16}}>
              <p style={{color:'var(--gray-500)',fontSize:'0.85rem',marginTop:0}}>Kies alle vakken waarin je examen doet. Je kunt dit later altijd wijzigen bij Instellingen.</p>
              {(settings.mijnVakken || []).length > 0 && (
                <div style={{marginBottom:12}}>
                  <button className="btn btn-outline btn-sm" style={{fontSize:'0.78rem'}} onClick={() => {
                    const merged = [...new Set([...gekozenVakken, ...(settings.mijnVakken || [])])];
                    setSettings(s => ({...s, examVakken: merged}));
                  }}>Notitievakken overnemen ({settings.mijnVakken.length} vakken)</button>
                </div>
              )}
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
                {beschikbareVakken.map(v => {
                  const selected = gekozenVakken.includes(v);
                  return (
                    <button key={v} className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-outline'}`} onClick={() => {
                      setSettings(s => ({...s, examVakken: selected ? s.examVakken.filter(x => x !== v) : [...(s.examVakken||[]), v]}));
                    }}>{v}</button>
                  );
                })}
              </div>
              {gekozenVakken.length > 0 && (
                <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={() => setExamSetupDone(true)}>
                  Opslaan ({gekozenVakken.length} vakken geselecteerd)
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Filter exams for this niveau and chosen subjects
    const myExams = examenRooster2026.filter(e =>
      e.levels.includes(niveau) && gekozenVakken.includes(e.subject)
    );
    const eersteTijdvak = myExams.filter(e => !e.tijdvak || e.tijdvak === 1).sort((a,b) => new Date(a.date+' '+a.time.split('-')[0]) - new Date(b.date+' '+b.time.split('-')[0]));
    const tweedeTijdvak = myExams.filter(e => e.tijdvak === 2).sort((a,b) => new Date(a.date+' '+a.time.split('-')[0]) - new Date(b.date+' '+b.time.split('-')[0]));

    const todayStr = new Date().toISOString().split('T')[0];
    const nextExam = eersteTijdvak.find(e => e.date >= todayStr) || tweedeTijdvak.find(e => e.date >= todayStr);
    const daysUntilNext = nextExam ? Math.ceil((new Date(nextExam.date) - new Date(todayStr)) / 86400000) : null;

    const formatExamDate = (dateStr) => {
      const d = new Date(dateStr);
      const days = ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
      const months = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
      return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
    };

    const renderExamList = (exams, title) => {
      if (exams.length === 0) return null;
      // Group by date
      const grouped = {};
      exams.forEach(e => { if (!grouped[e.date]) grouped[e.date] = []; grouped[e.date].push(e); });
      return (
        <div className="card" style={{marginBottom:20}}>
          <div className="card-header"><div className="card-title">{title}</div><span style={{fontSize:'0.78rem',color:'var(--gray-400)'}}>{exams.length} examens</span></div>
          <div style={{padding:'0 16px 16px'}}>
            {Object.entries(grouped).map(([date, dayExams]) => {
              const isPast = date < todayStr;
              const isToday = date === todayStr;
              return (
                <div key={date} style={{marginTop:14}}>
                  <div style={{fontSize:'0.78rem',fontWeight:600,color: isToday ? 'var(--accent)' : isPast ? 'var(--gray-300)' : 'var(--gray-500)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:6}}>
                    {isToday ? '📍 Vandaag — ' : ''}{formatExamDate(date)}
                  </div>
                  {dayExams.map((e, i) => {
                    const isPastExam = date < todayStr;
                    const isNext = nextExam && e.date === nextExam.date && e.subject === nextExam.subject && e.time === nextExam.time;
                    return (
                      <div key={i} style={{
                        display:'flex', alignItems:'center', gap:12, padding:'12px 14px', marginBottom:4,
                        borderRadius:'var(--radius)', border: isNext ? '2px solid var(--accent)' : '2px solid var(--gray-100)',
                        background: isNext ? 'var(--accent-light)' : isPastExam ? 'var(--gray-50)' : '#fff',
                        opacity: isPastExam ? 0.5 : 1,
                      }}>
                        <div style={{minWidth:90,fontSize:'0.82rem',fontWeight:600,color: isNext ? 'var(--accent)' : 'var(--gray-500)'}}>{e.time}</div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:600,fontSize:'0.9rem',color:'var(--gray-800)'}}>{e.subject}</div>
                        </div>
                        {isNext && <span style={{fontSize:'0.72rem',fontWeight:600,color:'var(--accent)',background:'var(--accent-light)',padding:'3px 10px',borderRadius:20,whiteSpace:'nowrap'}}>Volgende</span>}
                        {isPastExam && <span style={{fontSize:'0.72rem',color:'var(--gray-400)'}}>Afgerond</span>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div className="page-content">
        <div className="page-header">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
            <div>
              <h1>Examenrooster 2026</h1>
              <p>{niveau} — {gekozenVakken.length} vakken</p>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-outline btn-sm" onClick={() => setExamSetupDone(false)}>Vakken wijzigen</button>
              <button className="btn btn-outline btn-sm" onClick={() => { setExamSetupDone(false); setSettings(s => ({...s, niveau: '', examVakken: []})); }}>Niveau wijzigen</button>
            </div>
          </div>
        </div>

        {nextExam && (
          <div className="card" style={{marginBottom:20,background:'linear-gradient(135deg, var(--accent-light), #fff)',border:'2px solid var(--accent)'}}>
            <div style={{padding:20,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
              <div>
                <div style={{fontSize:'0.78rem',fontWeight:600,color:'var(--accent)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:4}}>Eerstvolgende examen</div>
                <div style={{fontSize:'1.2rem',fontWeight:700,color:'var(--gray-800)'}}>{nextExam.subject}</div>
                <div style={{fontSize:'0.85rem',color:'var(--gray-500)',marginTop:2}}>{formatExamDate(nextExam.date)} — {nextExam.time}</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:'2rem',fontWeight:800,color:'var(--accent)'}}>{daysUntilNext}</div>
                <div style={{fontSize:'0.78rem',color:'var(--gray-500)'}}>dag{daysUntilNext !== 1 ? 'en' : ''}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grades-overview" style={{marginBottom:20}}>
          <div className="grade-stat-card"><div className="grade-stat-value">{eersteTijdvak.length}</div><div className="grade-stat-label">Eerste tijdvak</div></div>
          <div className="grade-stat-card"><div className="grade-stat-value">{tweedeTijdvak.length}</div><div className="grade-stat-label">Tweede tijdvak</div></div>
          <div className="grade-stat-card"><div className="grade-stat-value">{gekozenVakken.length}</div><div className="grade-stat-label">Examenvakken</div></div>
          <div className="grade-stat-card"><div className="grade-stat-value">{daysUntilNext ?? '-'}</div><div className="grade-stat-label">Dagen tot examen</div></div>
        </div>

        {renderExamList(eersteTijdvak, 'Eerste tijdvak (8 mei - 27 mei)')}
        {renderExamList(tweedeTijdvak, 'Tweede tijdvak (16 juni - 23 juni)')}

        {myExams.length === 0 && (
          <div className="card"><div className="empty-state" style={{padding:40}}><p>Geen examens gevonden voor jouw vakken. Controleer je vakkenselectie.</p></div></div>
        )}
      </div>
    );
  }

  // --- INSTELLINGEN ---
  function renderInstellingen() {
    const isOverrideDay = settingsDayTab !== 'standaard';
    const overrides = settings.dayOverrides || {};
    const currentDayOverride = isOverrideDay ? (overrides[settingsDayTab] || {}) : {};
    const hasOverride = isOverrideDay && Object.keys(currentDayOverride).length > 0;

    const getDayVal = (key) => {
      if (isOverrideDay && currentDayOverride[key] !== undefined) return currentDayOverride[key];
      return settings[key];
    };

    const setDayVal = (key, value) => {
      if (!isOverrideDay) {
        setSettings(s => ({...s, [key]: value}));
      } else {
        setSettings(s => ({
          ...s,
          dayOverrides: {
            ...s.dayOverrides,
            [settingsDayTab]: { ...(s.dayOverrides?.[settingsDayTab] || {}), [key]: value },
          },
        }));
      }
    };

    const timetable = generateTimetablePreview(isOverrideDay ? settingsDayTab : null);
    return (
      <div className="page-content">
        <div className="page-header"><h1>Instellingen</h1><p>Pas je SchoolPlanner aan naar jouw wensen</p></div>
        <div className="settings-grid">
          <div className="card settings-card">
            <div className="card-header"><div className="card-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Profiel</div></div>
            <div className="settings-section">
              <div className="form-group"><label className="form-label">Naam</label><input type="text" className="form-input" value={settings.userName} onChange={e => setSettings(s => ({...s, userName: e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">E-mail</label><input type="email" className="form-input" value={settings.userEmail} onChange={e => setSettings(s => ({...s, userEmail: e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Klas</label><input type="text" className="form-input" value={settings.userClass} onChange={e => setSettings(s => ({...s, userClass: e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">School</label><input type="text" className="form-input" value={settings.schoolName} onChange={e => setSettings(s => ({...s, schoolName: e.target.value}))} /></div>
              <div className="form-group">
                <label className="form-label">Examenniveau</label>
                <select className="form-input" value={settings.niveau || ''} onChange={e => setSettings(s => ({...s, niveau: e.target.value, examVakken: []}))}>
                  <option value="">Niet ingesteld</option>
                  {['VMBO GL/TL','HAVO','VWO'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              {settings.niveau && (
                <div className="form-group">
                  <label className="form-label">Examenvakken</label>
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {(examVakkenPerNiveau[settings.niveau] || []).map(v => {
                      const sel = (settings.examVakken || []).includes(v);
                      return <button key={v} className={`btn btn-sm ${sel ? 'btn-primary' : 'btn-outline'}`} style={{fontSize:'0.76rem'}} onClick={() => {
                        setSettings(s => ({...s, examVakken: sel ? s.examVakken.filter(x => x !== v) : [...(s.examVakken||[]), v]}));
                      }}>{v}</button>;
                    })}
                  </div>
                  {(settings.examVakken || []).length > 0 && <div style={{fontSize:'0.78rem',color:'var(--gray-400)',marginTop:6}}>{settings.examVakken.length} vakken geselecteerd</div>}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Vakken voor huiswerk / toetsen / cijfers</label>
                <p style={{fontSize:'0.76rem',color:'var(--gray-400)',margin:'0 0 8px'}}>Kies welke vakken verschijnen als je huiswerk, toetsen of cijfers toevoegt. Leeg = alle vakken.</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {[...new Set([...Object.values(subjects).map(s => s.name), ...alleExamVakkenFlat])].sort().map(v => {
                    const sel = (settings.schoolVakken || []).includes(v);
                    return <button key={v} className={`btn btn-sm ${sel ? 'btn-primary' : 'btn-outline'}`} style={{fontSize:'0.76rem'}} onClick={() => {
                      setSettings(s => ({...s, schoolVakken: sel ? (s.schoolVakken||[]).filter(x => x !== v) : [...(s.schoolVakken||[]), v]}));
                    }}>{v}</button>;
                  })}
                </div>
                {(settings.schoolVakken || []).length > 0 && (
                  <div style={{display:'flex',alignItems:'center',gap:8,marginTop:6}}>
                    <span style={{fontSize:'0.78rem',color:'var(--gray-400)'}}>{settings.schoolVakken.length} vakken geselecteerd</span>
                    <button className="btn btn-outline btn-sm" style={{fontSize:'0.7rem',padding:'2px 8px'}} onClick={() => setSettings(s => ({...s, schoolVakken: []}))}>Reset</button>
                    {(settings.examVakken || []).length > 0 && <button className="btn btn-outline btn-sm" style={{fontSize:'0.7rem',padding:'2px 8px'}} onClick={() => setSettings(s => ({...s, schoolVakken: [...new Set([...(s.schoolVakken||[]), ...(s.examVakken||[])])]}))}>+ Examenvakken</button>}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="card settings-card">
            <div className="card-header"><div className="card-title"><Icon name="clock" /> Lesuren &amp; Rooster</div></div>
            <div style={{display:'flex',gap:4,flexWrap:'wrap',padding:'0 16px 8px',borderBottom:'1px solid var(--gray-100)',marginBottom:8}}>
              <button className={`btn btn-sm ${settingsDayTab==='standaard'?'btn-primary':'btn-outline'}`} onClick={() => setSettingsDayTab('standaard')}>Standaard</button>
              {dayNames.map((d,i) => (
                <button key={d} className={`btn btn-sm ${settingsDayTab===d?'btn-primary':'btn-outline'}`} style={{position:'relative'}} onClick={() => setSettingsDayTab(d)}>
                  {dayLabels[i].slice(0,2)}
                  {overrides[d] && Object.keys(overrides[d]).length > 0 && <span style={{position:'absolute',top:-2,right:-2,width:6,height:6,background:'var(--accent)',borderRadius:'50%'}}></span>}
                </button>
              ))}
            </div>
            {isOverrideDay && (
              <div style={{padding:'4px 16px 8px',fontSize:'0.78rem',color:'var(--gray-400)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>{hasOverride ? `Aangepast rooster voor ${settingsDayTab}` : `Gebruikt standaard instellingen`}</span>
                {hasOverride && <button className="btn btn-outline btn-sm" style={{fontSize:'0.7rem',padding:'2px 8px'}} onClick={() => {
                  setSettings(s => {
                    const newOverrides = {...(s.dayOverrides || {})};
                    delete newOverrides[settingsDayTab];
                    return {...s, dayOverrides: newOverrides};
                  });
                }}>Reset naar standaard</button>}
              </div>
            )}
            <div className="settings-section">
              <div className="form-group"><label className="form-label">Aantal lesuren per dag</label><input type="number" className="form-input" value={getDayVal('maxLessons')} min="1" max="14" onChange={e => setDayVal('maxLessons', parseInt(e.target.value)||8)} /></div>
              <div className="form-group"><label className="form-label">Lesduur (minuten)</label><input type="number" className="form-input" value={getDayVal('lessonDuration')} min="30" max="90" onChange={e => setDayVal('lessonDuration', parseInt(e.target.value)||50)} /></div>
              <div className="form-group"><label className="form-label">Eerste les begint om</label><input type="time" className="form-input" value={getDayVal('startTime')} onChange={e => setDayVal('startTime', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Pauze na uur</label><input type="number" className="form-input" value={getDayVal('breakAfter')} min="1" max="14" onChange={e => setDayVal('breakAfter', parseInt(e.target.value)||2)} /></div>
              <div className="form-group"><label className="form-label">Pauzeduur (min)</label><input type="number" className="form-input" value={getDayVal('breakDuration')} min="5" max="30" onChange={e => setDayVal('breakDuration', parseInt(e.target.value)||20)} /></div>
              <div className="form-group"><label className="form-label">Lunch na uur</label><input type="number" className="form-input" value={getDayVal('lunchAfter')} min="1" max="14" onChange={e => setDayVal('lunchAfter', parseInt(e.target.value)||4)} /></div>
              <div className="form-group"><label className="form-label">Lunchduur (min)</label><input type="number" className="form-input" value={getDayVal('lunchDuration')} min="15" max="60" onChange={e => setDayVal('lunchDuration', parseInt(e.target.value)||30)} /></div>
              <div className="form-group">
                <label className="form-label" style={{display:'flex',alignItems:'center',gap:8}}>
                  <input type="checkbox" checked={getDayVal('break2Enabled') || false} onChange={e => setDayVal('break2Enabled', e.target.checked)} style={{width:16,height:16,accentColor:'var(--accent)'}} />
                  Extra pauze na de lunch
                </label>
              </div>
              {getDayVal('break2Enabled') && (<>
                <div className="form-group"><label className="form-label">2e pauze na uur</label><input type="number" className="form-input" value={getDayVal('break2After')} min="1" max="14" onChange={e => setDayVal('break2After', parseInt(e.target.value)||6)} /></div>
                <div className="form-group"><label className="form-label">2e pauzeduur (min)</label><input type="number" className="form-input" value={getDayVal('break2Duration')} min="5" max="30" onChange={e => setDayVal('break2Duration', parseInt(e.target.value)||15)} /></div>
              </>)}
            </div>
            <div className="settings-timetable-preview">
              <div className="settings-timetable-title">Uuroverzicht{isOverrideDay ? ` — ${settingsDayTab.charAt(0).toUpperCase()+settingsDayTab.slice(1)}` : ''}</div>
              <div className="timetable-preview">{timetable.map((r,i) => <div key={i} className={`timetable-preview-row ${r.isBreak?'break':''}`}><span className="timetable-preview-hour">{r.label}</span><span className="timetable-preview-time">{r.time}</span></div>)}</div>
            </div>
          </div>
          <div className="card settings-card">
            <div className="card-header"><div className="card-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Koppelingen</div></div>
            <div className="settings-section">
              <div className="settings-connect-row">
                <div className="settings-connect-info"><strong>Magister</strong><span className={`settings-connect-status ${magistarConnected?'active':''}`}>{magistarConnected ? `Verbonden als ${magistarAccount.user||'onbekend'}` : 'Niet verbonden'}</span></div>
                <button className={`btn ${magistarConnected?'btn-outline':'btn-primary'} btn-sm`} onClick={() => openMagisterModal('instellingen')}>{magistarConnected ? 'Beheren' : 'Verbinden'}</button>
              </div>
              <div className="settings-connect-row">
                <div className="settings-connect-info"><strong>📅 ICS Kalenders</strong><span className={`settings-connect-status ${Object.keys(icsUrls).length>0?'active':''}`}>{Object.keys(icsUrls).length > 0 ? `${Object.keys(icsUrls).length} kalender(s) gekoppeld` : 'Geen kalenders gekoppeld'}</span></div>
                <button className="btn btn-primary btn-sm" onClick={openCalendarConnectModal}>{Object.keys(icsUrls).length > 0 ? 'Beheren' : 'Toevoegen'}</button>
              </div>
            </div>
          </div>
          <div className="card settings-card">
            <div className="card-header"><div className="card-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Zichtbare pagina{"'"}s</div></div>
            <div className="settings-section">
              <p style={{fontSize:'0.8rem',color:'var(--gray-400)',margin:'0 0 12px'}}>Kies welke pagina{"'"}s je wilt zien in de navigatie en op het dashboard.</p>
              {Object.entries(routes).map(([key, route]) => (
                <div key={key} className="settings-toggle-row">
                  <div><div className="settings-toggle-label">{route.title}</div></div>
                  <label className="settings-toggle"><input type="checkbox" checked={!(settings.hiddenPages || []).includes(key)} onChange={e => {
                    const isHidden = !e.target.checked;
                    setSettings(s => ({...s, hiddenPages: isHidden ? [...(s.hiddenPages || []), key] : (s.hiddenPages || []).filter(p => p !== key)}));
                  }} /><span className="settings-toggle-slider"></span></label>
                </div>
              ))}
            </div>
          </div>
          <div className="card settings-card">
            <div className="card-header"><div className="card-title"><Icon name="bell" /> Meldingen &amp; Overig</div></div>
            <div className="settings-section">
              <div className="settings-toggle-row">
                <div><div className="settings-toggle-label">Meldingen</div><div className="settings-toggle-desc">Ontvang notificaties voor deadlines en toetsen</div></div>
                <label className="settings-toggle"><input type="checkbox" checked={settings.notifications} onChange={e => setSettings(s => ({...s, notifications: e.target.checked}))} /><span className="settings-toggle-slider"></span></label>
              </div>
              <div className="settings-toggle-row">
                <div><div className="settings-toggle-label">Weekend verbergen</div><div className="settings-toggle-desc">Verberg zaterdag en zondag in het rooster</div></div>
                <label className="settings-toggle"><input type="checkbox" checked={settings.weekendHidden} onChange={e => setSettings(s => ({...s, weekendHidden: e.target.checked}))} /><span className="settings-toggle-slider"></span></label>
              </div>
            </div>
            <div className="settings-section" style={{marginTop:20,borderTop:'1px solid var(--gray-100)',paddingTop:20}}>
              <div className="settings-plan-info"><div className="settings-plan-badge">Pro</div><div className="settings-plan-desc">Je hebt toegang tot alle functies inclusief koppelingen en onbeperkte opslag.</div></div>
            </div>
            <div style={{marginTop:16}}>
              <button className="btn btn-outline" style={{width:'100%',justifyContent:'center',color:'#EF4444',borderColor:'#FCA5A5'}} onClick={() => { setIsLoggedIn(false); setCurrentPage('dashboard'); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER PAGE
  // ============================================================
  function renderCurrentPage() {
    switch(currentPage) {
      case 'dashboard': return renderDashboard();
      case 'rooster': return renderRooster();
      case 'huiswerk': return renderHuiswerk();
      case 'toetsen': return renderToetsen();
      case 'agenda': return renderAgenda();
      case 'cijfers': return renderCijfers();
      case 'examens': return renderExamens();
      case 'pomodoro': return renderPomodoro();
      case 'notities': return renderNotities();
      case 'instellingen': return renderInstellingen();
      default: return renderDashboard();
    }
  }

  // ============================================================
  // APP SHELL
  // ============================================================
  return (
    <div className="app-shell" style={{display:'block'}}>
      <nav className="navbar">
        <div className="navbar-logo">{icons.graduationCap} SchoolPlanner</div>
        <div className="navbar-links">
          {Object.entries(routes).filter(([key]) => !(settings.hiddenPages || []).includes(key)).map(([key, route]) => (
            <div key={key} className={`navbar-link ${currentPage === key ? 'active' : ''}`} onClick={() => navigate(key)}>{route.title}</div>
          ))}
        </div>
        <div className="navbar-right">
          <div className="navbar-icon-btn" onClick={toggleDarkMode} title={darkMode ? 'Lichte modus' : 'Donkere modus'}>
            <span style={{ display: 'inline-flex', width: 20, height: 20 }}>{darkMode ? icons.sun : icons.moon}</span>
          </div>
          <div className="navbar-icon-btn" onClick={() => navigate('instellingen')} title="Instellingen">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div className="navbar-profile" style={{position:'relative'}} onClick={(e) => { e.stopPropagation(); setProfileOpen(p => !p); }}>
            <div className="navbar-avatar">{settings.userName.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
            <span className="navbar-profile-name">{settings.userName}</span>
            {profileOpen && (
              <div className="profile-dropdown" onClick={e => e.stopPropagation()}>
                <div className="profile-dropdown-header">
                  <div className="navbar-avatar" style={{width:40,height:40,fontSize:'0.95rem'}}>{settings.userName.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                  <div><div style={{fontWeight:600,fontSize:'0.88rem',color:'var(--gray-800)'}}>{settings.userName}</div><div style={{fontSize:'0.76rem',color:'var(--gray-400)'}}>{settings.userEmail}</div></div>
                </div>
                <div className="profile-dropdown-divider"></div>
                <div className="profile-dropdown-item" onClick={() => { navigate('dashboard'); setProfileOpen(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Dashboard
                </div>
                <div className="profile-dropdown-item" onClick={() => { navigate('instellingen'); setProfileOpen(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/></svg>
                  Instellingen
                </div>
                <div className="profile-dropdown-divider"></div>
                <div className="profile-dropdown-item logout" onClick={() => { setIsLoggedIn(false); localStorage.setItem('sp_logged_in', 'false'); setProfileOpen(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  Uitloggen
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        {timerAlert && (
          <div style={{
            position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', zIndex:9999,
            background: timerAlert.type === 'work' ? '#EF4444' : '#10B981', color:'#fff',
            padding:'14px 24px', borderRadius:14, boxShadow:'0 8px 32px rgba(0,0,0,0.18)',
            display:'flex', alignItems:'center', gap:14, fontSize:'0.9rem', fontWeight:600,
            animation:'slideDown 0.4s ease',maxWidth:480,width:'90%'
          }}>
            <span style={{display:'inline-flex',width:22,height:22}}>{icons.timer}</span>
            <span style={{flex:1}}>{timerAlert.message}</span>
            {currentPage !== 'pomodoro' && <button style={{background:'rgba(255,255,255,0.25)',border:'none',borderRadius:8,padding:'6px 14px',color:'#fff',fontWeight:600,cursor:'pointer',fontSize:'0.82rem'}}
              onClick={() => { setTimerAlert(null); navigate('pomodoro'); }}>Ga naar timer</button>}
            <span style={{cursor:'pointer',opacity:0.7,fontSize:'1.2rem',lineHeight:1}} onClick={() => setTimerAlert(null)}>×</span>
          </div>
        )}
        <div className="container">{renderCurrentPage()}</div>
      </main>

      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          {Object.entries(routes).filter(([key]) => !(settings.hiddenPages || []).includes(key)).map(([key, route]) => (
            <div key={key} className={`mobile-nav-item ${currentPage === key ? 'active' : ''}`} onClick={() => navigate(key)}>
              <Icon name={route.icon} size={22} />
              {route.title}
            </div>
          ))}
        </div>
      </nav>

      <div className="modal-overlay" id="modal-overlay" style={{ opacity: modal ? 1 : 0, pointerEvents: modal ? 'all' : 'none' }}>
        {renderModal()}
      </div>
    </div>
  );
}
