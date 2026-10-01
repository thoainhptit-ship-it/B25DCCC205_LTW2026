import React, { useState } from 'react';

// Dữ liệu mẫu
const initialStudents = [
  { id: 'SV001', name: 'Nguyễn Văn An', score: 8.5, studentClass: 'CNTT-K62' },
  { id: 'SV002', name: 'Trần Thị Bình', score: 4.2, studentClass: 'KTPM-K63' },
  { id: 'SV003', name: 'Lê Hoàng Cường', score: 9.0, studentClass: 'KHMT-K61' },
  { id: 'SV004', name: 'Phạm Minh Đức', score: 6.8, studentClass: 'CNTT-K62' },
  { id: 'SV005', name: 'Đỗ Thị Hoa', score: 3.5, studentClass: 'HTTH-K63' }
];

// CSS viết thẳng trong file cho gọn, không dùng Tailwind
const css = `
  body { margin: 0; background: #f2f2f2; }
  .page { font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #222;
          max-width: 860px; margin: 0 auto; padding: 20px 16px 40px; }
  .page h1 { font-size: 24px; margin: 0 0 4px; }
  .page .sub { margin: 0 0 18px; color: #666; }
  .page h2 { font-size: 16px; margin: 0 0 10px; }

  .box { background: #fff; border: 1px solid #bbb; padding: 12px 14px; margin-bottom: 16px; }

  .stats { width: 100%; border-collapse: collapse; margin-bottom: 16px; background: #fff; }
  .stats td { border: 1px solid #bbb; padding: 8px 12px; width: 25%; }
  .stats b { display: block; font-size: 20px; margin-top: 2px; }

  .row { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end; }
  .row label { display: block; font-size: 13px; margin-bottom: 3px; }
  .row input { padding: 4px 6px; border: 1px solid #888; font-size: 14px; width: 170px; }
  .row input.small { width: 90px; }

  button { padding: 4px 12px; border: 1px solid #666; background: #e6e6e6; font-size: 13px; cursor: pointer; }
  button:hover { background: #d4d4d4; }
  button.on { background: #333; color: #fff; border-color: #333; }

  .err { color: #b00020; margin: 0 0 8px; }

  .bar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
  .bar input { flex: 1; min-width: 200px; padding: 4px 6px; border: 1px solid #888; font-size: 14px; }

  table.ds { width: 100%; border-collapse: collapse; background: #fff; }
  table.ds th, table.ds td { border: 1px solid #bbb; padding: 6px 8px; text-align: left; }
  table.ds th { background: #e9e9e9; }
  table.ds tr:nth-child(even) td { background: #fafafa; }
  .gioi { color: #1a7a1a; font-weight: bold; }
  .dat { color: #222; }
  .truot { color: #b00020; font-weight: bold; }
  .empty { padding: 20px; text-align: center; background: #fff; border: 1px solid #bbb; }
`;

// Thống kê
const StatisticsCard = ({ students }) => {
  const total = students.length;
  const totalScore = students.reduce((acc, curr) => acc + Number(curr.score), 0);
  const averageScore = total > 0 ? (totalScore / total).toFixed(2) : '0.00';
  const excellentCount = students.filter(s => s.score >= 8).length;
  const failedCount = students.filter(s => s.score < 5).length;

  return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Tổng sinh viên<b>{total}</b></td>
          <td>Điểm trung bình<b>{averageScore}</b></td>
          <td>Giỏi (từ 8.0)<b>{excellentCount}</b></td>
          <td>Trượt (dưới 5.0)<b>{failedCount}</b></td>
        </tr>
      </tbody>
    </table>
  );
};

// Form thêm sinh viên
const StudentForm = ({ onAddStudent }) => {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || score === '' || !studentClass.trim()) {
      setError('Vui lòng nhập đầy đủ họ tên, điểm và lớp.');
      return;
    }

    const numericScore = parseFloat(score);
    if (isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
      setError('Điểm phải nằm trong khoảng 0 đến 10.');
      return;
    }

    onAddStudent({
      id: `SV${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      score: numericScore,
      studentClass: studentClass.trim()
    });

    setName('');
    setScore('');
    setStudentClass('');
    setError('');
  };

  return (
    <div className="box">
      <h2>Thêm sinh viên</h2>
      {error && <p className="err">{error}</p>}
      <form className="row" onSubmit={handleSubmit}>
        <div>
          <label>Họ và tên</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Điểm (0 - 10)</label>
          <input
            className="small"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </div>
        <div>
          <label>Lớp</label>
          <input
            className="small"
            type="text"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
          />
        </div>
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
};

// Một dòng trong bảng
const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, studentClass } = student;

  const getRank = (s) => (s >= 8 ? 'Giỏi' : s >= 5 ? 'Đạt' : 'Trượt');
  const getClass = (s) => (s >= 8 ? 'gioi' : s >= 5 ? 'dat' : 'truot');

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{studentClass}</td>
      <td>{score.toFixed(1)}</td>
      <td className={getClass(score)}>{getRank(score)}</td>
      <td>
        <button onClick={() => onDelete(id)}>Xóa</button>
      </td>
    </tr>
  );
};

// Bảng sinh viên
const StudentTable = ({ students, onDeleteStudent }) => {
  if (students.length === 0) {
    return <div className="empty">Không có sinh viên nào phù hợp.</div>;
  }

  return (
    <table className="ds">
      <thead>
        <tr>
          <th>Mã SV</th>
          <th>Họ và tên</th>
          <th>Lớp</th>
          <th>Điểm</th>
          <th>Xếp loại</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <StudentItem key={student.id} student={student} onDelete={onDeleteStudent} />
        ))}
      </tbody>
    </table>
  );
};

// Component cha
const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [filterType, setFilterType] = useState('ALL'); // ALL | EXCELLENT | FAILED
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleDeleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredStudents = students.filter((student) => {
    const matchesFilter =
      filterType === 'ALL'
        ? true
        : filterType === 'EXCELLENT'
        ? student.score >= 8.0
        : student.score < 5.0;

    const keyword = searchTerm.toLowerCase();
    const matchesSearch =
      student.name.toLowerCase().includes(keyword) ||
      student.studentClass.toLowerCase().includes(keyword);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page">
      <style>{css}</style>

      <h1>Quản lý điểm sinh viên</h1>
      <p className="sub">Theo dõi và thống kê kết quả học tập</p>

      <StatisticsCard students={students} />
      <StudentForm onAddStudent={handleAddStudent} />

      <div className="bar">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc lớp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={filterType === 'ALL' ? 'on' : ''} onClick={() => setFilterType('ALL')}>
          Tất cả ({students.length})
        </button>
        <button className={filterType === 'EXCELLENT' ? 'on' : ''} onClick={() => setFilterType('EXCELLENT')}>
          Giỏi
        </button>
        <button className={filterType === 'FAILED' ? 'on' : ''} onClick={() => setFilterType('FAILED')}>
          Trượt
        </button>
      </div>

      <StudentTable students={filteredStudents} onDeleteStudent={handleDeleteStudent} />
    </div>
  );
};

export default App;