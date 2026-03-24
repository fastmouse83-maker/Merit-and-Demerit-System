export interface Student {
  id: string; // 학번
  name: string; // 이름
  photoUrl: string; // 사진URL
}

export interface PointItem {
  id: string; // 항목코드
  category: string; // 구분 (상점/벌점)
  content: string; // 상벌점내용
  score: number; // 점수
  type: 'merit' | 'demerit';
}

export interface PointRecord {
  id: string;
  date: string; // 일시
  studentId: string; // 학번
  studentName: string; // 이름
  content: string; // 상벌점내용
  score: number; // 점수
  teacher: string; // 확인교사
  note: string; // 비고(상세내용)
}
