import React, { useState } from 'react';
import { Search, Plus, History, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Student, PointItem, PointRecord } from '../types';

interface PointManagementProps {
  records: PointRecord[];
  students: Student[];
  pointItems: PointItem[];
  onAddRecord: (record: Omit<PointRecord, 'id' | 'date'>) => void;
}

const PointManagement: React.FC<PointManagementProps> = ({ records, students, pointItems, onAddRecord }) => {
  const [searchId, setSearchId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedPointId, setSelectedPointId] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [note, setNote] = useState('');

  const handleSearch = () => {
    const student = students.find(s => s.id === searchId);
    setSelectedStudent(student || null);
    if (!student) alert('학생을 찾을 수 없습니다.');
  };

  const studentRecords = selectedStudent 
    ? records.filter(r => r.studentId === selectedStudent.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const totalScore = studentRecords.reduce((acc, curr) => acc + curr.score, 0);

  const currentIndex = selectedStudent ? students.findIndex(s => s.id === selectedStudent.id) : -1;

  const handlePrevStudent = () => {
    if (currentIndex > 0) {
      setSelectedStudent(students[currentIndex - 1]);
      setSearchId(students[currentIndex - 1].id);
    }
  };

  const handleNextStudent = () => {
    if (currentIndex < students.length - 1) {
      setSelectedStudent(students[currentIndex + 1]);
      setSearchId(students[currentIndex + 1].id);
    }
  };

  const handleAddPoint = () => {
    if (!selectedStudent || !selectedPointId) return;
    const pointItem = pointItems.find(p => p.id === selectedPointId);
    if (!pointItem) return;

    onAddRecord({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      content: pointItem.content,
      score: pointItem.score,
      teacher: teacherName || '관리자',
      note: note || pointItem.content
    });

    setNote('');
    setSelectedPointId('');
    alert('상벌점이 부여되었습니다.');
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">상벌점 관리</h2>
        <p className="text-sm md:text-base text-zinc-500">학생 검색 및 상벌점 부여</p>
      </header>

      <div className="flex gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="학번 입력 (예: 1101)"
            className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition-all active:scale-95"
        >
          검색
        </button>
      </div>

      {selectedStudent ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Profile */}
          <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10">
              <button
                onClick={handlePrevStudent}
                disabled={currentIndex <= 0}
                className="p-2 rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10">
              <button
                onClick={handleNextStudent}
                disabled={currentIndex >= students.length - 1}
                className="p-2 rounded-full bg-white border border-zinc-200 text-zinc-400 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="w-32 h-40 md:w-48 md:h-60 bg-zinc-100 rounded-xl overflow-hidden mb-6 border border-zinc-200 shadow-lg flex items-center justify-center">
              {selectedStudent.photoUrl ? (
                <img 
                  src={selectedStudent.photoUrl} 
                  alt={selectedStudent.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-12 h-12 md:w-16 md:h-16 text-zinc-300" />
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-zinc-900">{selectedStudent.name}</h3>
            <p className="text-sm md:text-base text-zinc-500 font-medium mb-4">{selectedStudent.id}</p>
            
            <div className="w-full pt-6 border-t border-zinc-100">
              <p className="text-xs md:text-sm text-zinc-500 mb-1">현재 상벌점 합계</p>
              <p className={`text-3xl md:text-4xl font-black ${totalScore >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {totalScore > 0 ? `+${totalScore}` : totalScore}
              </p>
            </div>
          </div>

          {/* Award Points */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Plus className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-bold">상벌점 부여</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">항목 선택</label>
                <select
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  value={selectedPointId}
                  onChange={(e) => setSelectedPointId(e.target.value)}
                >
                  <option value="">항목을 선택하세요</option>
                  <optgroup label="상점 항목">
                    {pointItems.filter(p => p.type === 'merit').map(p => (
                      <option key={p.id} value={p.id}>
                        [{p.id}] {p.category}-{p.content}({p.score > 0 ? `+${p.score}` : p.score}점)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="벌점 항목">
                    {pointItems.filter(p => p.type === 'demerit').map(p => (
                      <option key={p.id} value={p.id}>
                        [{p.id}] {p.category}-{p.content}({p.score}점)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  확인교사 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="교사 이름을 입력하세요"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">비고 (상세내용)</label>
                <textarea
                  placeholder="추가 설명이 필요한 경우 입력하세요"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all min-h-[100px]"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <button
                onClick={handleAddPoint}
                disabled={!selectedPointId || !teacherName.trim()}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                상벌점 부여하기
              </button>
            </div>
          </div>

          {/* Student History */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-bold">개인 상벌점 기록</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">일시</th>
                    <th className="px-6 py-4 font-semibold">내용</th>
                    <th className="px-6 py-4 font-semibold">점수</th>
                    <th className="px-6 py-4 font-semibold">확인교사</th>
                    <th className="px-6 py-4 font-semibold">비고</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {studentRecords.length > 0 ? (
                    studentRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-zinc-600">{record.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-zinc-900">{record.content}</td>
                        <td className={`px-6 py-4 text-sm font-bold ${record.score > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {record.score > 0 ? `+${record.score}` : record.score}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600">{record.teacher}</td>
                        <td className="px-6 py-4 text-sm text-zinc-500 italic">{record.note}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 italic">기록이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-zinc-300" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">학생을 검색해주세요</h3>
          <p className="text-zinc-500 max-w-xs">학번을 입력하여 학생을 찾고 상벌점을 관리할 수 있습니다.</p>
        </div>
      )}
    </div>
  );
};

export default PointManagement;
