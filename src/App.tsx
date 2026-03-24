/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Dashboard from './components/Dashboard';
import PointManagement from './components/PointManagement';
import PointLog from './components/PointLog';
import { PointRecord, Student, PointItem } from './types';
import { initialRecords, students as mockStudents, pointItems as mockPointItems } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState<PointRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [pointItems, setPointItems] = useState<PointItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
      const data = await response.json();
      setRecords(data.records);
      setStudents(data.students);
      setPointItems(data.pointItems);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('구글 시트 연동 설정을 확인해주세요.');
      // Fallback to initial records for demo if API fails
      setRecords(initialRecords);
      setStudents(mockStudents);
      setPointItems(mockPointItems);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleAddRecord = async (newRecord: Omit<PointRecord, 'id' | 'date'>) => {
    const dateStr = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\. /g, '-').replace('.', '');

    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newRecord, date: dateStr })
      });

      if (!response.ok) throw new Error('기록 저장에 실패했습니다.');
      
      // Refresh data after successful save
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('기록 저장 중 오류가 발생했습니다.');
      
      // Optimistic update if API fails (for demo)
      const record: PointRecord = {
        ...newRecord,
        id: `r${Date.now()}`,
        date: dateStr
      };
      setRecords(prev => [record, ...prev]);
    }
  };

  if (isLoading && records.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-medium">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 h-screen overflow-y-auto pb-20 md:pb-0">
        {error && (
          <div className="m-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center justify-between">
            <span>⚠️ {error} (환경 변수 설정을 완료해주세요)</span>
            <button onClick={fetchData} className="underline font-bold">다시 시도</button>
          </div>
        )}
        {activeTab === 'dashboard' && <Dashboard records={records} />}
        {activeTab === 'management' && (
          <PointManagement 
            records={records} 
            students={students}
            pointItems={pointItems}
            onAddRecord={handleAddRecord} 
          />
        )}
        {activeTab === 'log' && <PointLog records={records} />}
      </main>
    </div>
  );
}

