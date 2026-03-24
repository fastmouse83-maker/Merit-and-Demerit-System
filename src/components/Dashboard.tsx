import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, TrendingDown, Users, Award } from 'lucide-react';
import { PointRecord } from '../types';

interface DashboardProps {
  records: PointRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const totalMerit = records.filter(r => r.score > 0).reduce((acc, curr) => acc + curr.score, 0);
  const totalDemerit = records.filter(r => r.score < 0).reduce((acc, curr) => acc + Math.abs(curr.score), 0);
  const totalActions = records.length;
  const teacherCount = new Set(records.map(r => r.teacher)).size;
  const studentCount = new Set(records.map(r => r.studentId)).size;
  
  const chartData = [
    { name: '상점', value: totalMerit, color: '#10b981' },
    { name: '벌점', value: totalDemerit, color: '#ef4444' },
  ];

  // Group by student for top performers
  const studentStats = records.reduce((acc: any, curr) => {
    if (!acc[curr.studentName]) acc[curr.studentName] = 0;
    acc[curr.studentName] += curr.score;
    return acc;
  }, {});

  const topStudents = Object.entries(studentStats)
    .map(([name, score]) => ({ name, score: score as number }))
    .filter(s => s.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">대시보드</h2>
        <p className="text-sm md:text-base text-zinc-500">상벌점 현황 및 통계 요약</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <StatCard title="누적 상점" value={totalMerit} icon={TrendingUp} color="text-emerald-600" bgColor="bg-emerald-50" />
        <StatCard title="누적 벌점" value={totalDemerit} icon={TrendingDown} color="text-red-600" bgColor="bg-red-50" />
        <StatCard title="전체 기록" value={totalActions} icon={Award} color="text-indigo-600" bgColor="bg-indigo-50" />
        <StatCard title="학생 수" value={studentCount} icon={Users} color="text-zinc-600" bgColor="bg-zinc-100" />
        <StatCard title="교사 수" value={teacherCount} icon={Users} color="text-orange-600" bgColor="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">상벌점 비율</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            {chartData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-sm text-zinc-600 font-medium">{d.name}: {d.value}점</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">상점 우수 학생 (Top 5)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topStudents} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {topStudents.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, bgColor }: any) => (
  <div className="bg-white p-4 md:p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-[10px] md:text-sm text-zinc-500 font-medium mb-1">{title}</p>
      <p className="text-lg md:text-2xl font-bold">{value}</p>
    </div>
    <div className={`p-2 md:p-3 rounded-xl ${bgColor}`}>
      <Icon className={`w-4 h-4 md:w-6 md:h-6 ${color}`} />
    </div>
  </div>
);

export default Dashboard;
