import React from 'react';
import { Search, Download } from 'lucide-react';
import { PointRecord } from '../types';

interface PointLogProps {
  records: PointRecord[];
}

const PointLog: React.FC<PointLogProps> = ({ records }) => {
  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">상벌점 로그</h2>
          <p className="text-sm md:text-base text-zinc-500">전체 학생 상벌점 기록 내역</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-700 font-medium hover:bg-zinc-50 transition-all shadow-sm">
          <Download className="w-4 h-4" />
          CSV 다운로드
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="이름 또는 학번 검색"
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">일시</th>
                <th className="px-6 py-4 font-semibold">학번</th>
                <th className="px-6 py-4 font-semibold">이름</th>
                <th className="px-6 py-4 font-semibold">상벌점내용</th>
                <th className="px-6 py-4 font-semibold">점수</th>
                <th className="px-6 py-4 font-semibold">확인교사</th>
                <th className="px-6 py-4 font-semibold">비고(상세내용)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {sortedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-zinc-600 whitespace-nowrap">{record.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900">{record.studentId}</td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900">{record.studentName}</td>
                  <td className="px-6 py-4 text-sm text-zinc-700">{record.content}</td>
                  <td className={`px-6 py-4 text-sm font-bold ${record.score > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {record.score > 0 ? `+${record.score}` : record.score}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600">{record.teacher}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500 italic max-w-xs truncate">{record.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PointLog;
