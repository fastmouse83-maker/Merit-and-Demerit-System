import { Student, PointRecord, PointItem } from '../types';

export const students: Student[] = [
  { id: '1101', name: '기태연', photoUrl: 'https://drive.google.com/uc?id=1-QOH9sdSELMMCFDNPk7tiQMFH1cch7c5' },
  { id: '1102', name: '김효일', photoUrl: 'https://drive.google.com/uc?id=15MgJL869qNgGPuB3IACWMbNjtXMM3CEc' },
  { id: '1103', name: '박진우', photoUrl: 'https://drive.google.com/uc?id=1z4Nstlaww-WG77-cvw8ftKJDV59D-sNJ' },
  { id: '1104', name: '서규원', photoUrl: 'https://drive.google.com/uc?id=10J9hrVYtnDm0qZ_i9ucRCAqsMmWXhsvU' },
  { id: '1105', name: '신해', photoUrl: 'https://drive.google.com/uc?id=1mwUrxsXC8ALbBERMNEDR-rzGD_TJoXq8' },
  { id: '1106', name: '육준성', photoUrl: 'https://drive.google.com/uc?id=1_fbwnxwE2EvL1CuKMDZeQWAYcqeghgfE' },
  { id: '1107', name: '윤시웅', photoUrl: 'https://drive.google.com/uc?id=1_HCkgNLjQBFHA1NFVLPL74gqWKs5t7n1' },
  { id: '1108', name: '윤정후', photoUrl: 'https://drive.google.com/uc?id=1BtqbWnc6Go4RFRumghdg-w5Q1f_ONx98' },
  { id: '1109', name: '이민준', photoUrl: 'https://drive.google.com/uc?id=1pw4O8tYTBBhNgKfj4s4aB_pDu6iN8M58' },
  { id: '1110', name: '이상희', photoUrl: 'https://drive.google.com/uc?id=1hjDt1rnfQbESFOWlhqKpFyvQ2xZ0Ujwv' },
  { id: '1111', name: '이효은', photoUrl: 'https://drive.google.com/uc?id=1tAFfxCSs9h6pAI9i3vO-jC_ZK3mTZWFS' },
  { id: '1112', name: '임소영', photoUrl: 'https://drive.google.com/uc?id=1uiduPt366-VOKGOUjr2MHRr7sltWrLrk' },
  { id: '1113', name: '전유림', photoUrl: 'https://drive.google.com/uc?id=1OewyiayMBXUd8nfd3hijvCugrcX0n4ul' },
  { id: '1114', name: '정서영', photoUrl: 'https://drive.google.com/uc?id=1D5_Y17vpLVKvD87hepnp0VVWKEixilWeC' },
  { id: '1115', name: '정현윤', photoUrl: 'https://drive.google.com/uc?id=1TVey9PM8JJCpQIMihWPP8GlXpGp7eg7' },
  { id: '1201', name: '강재호', photoUrl: 'https://drive.google.com/uc?id=1Gh8LQnyjnd77G12ZrmS7FF_TozdRCcGR' },
  { id: '1202', name: '김태희', photoUrl: 'https://drive.google.com/uc?id=1PaBlikgQfoovgQCmMaD-EvBL1cbXUJvu' },
];

export const pointItems: PointItem[] = [
  { id: 'm1', category: '상점', content: '수업 태도 우수', score: 2, type: 'merit' },
  { id: 'm2', category: '상점', content: '교내 봉사 활동', score: 5, type: 'merit' },
  { id: 'm3', category: '상점', content: '선행상 수상', score: 10, type: 'merit' },
  { id: 'd1', category: '벌점', content: '지각', score: -1, type: 'demerit' },
  { id: 'd2', category: '벌점', content: '수업 방해', score: -2, type: 'demerit' },
  { id: 'd3', category: '벌점', content: '복장 불량', score: -1, type: 'demerit' },
  { id: 'd4', category: '벌점', content: '무단 결과', score: -3, type: 'demerit' },
];

export const initialRecords: PointRecord[] = [
  { id: 'r1', date: '2024-03-01 09:00', studentId: '1101', studentName: '기태연', content: '수업 태도 우수', score: 2, teacher: '홍길동', note: '적극적인 참여' },
  { id: 'r2', date: '2024-03-02 10:30', studentId: '1102', studentName: '김효일', content: '지각', score: -1, teacher: '김철수', note: '5분 지각' },
];
