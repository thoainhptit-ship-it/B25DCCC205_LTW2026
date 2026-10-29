import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';
import DataStatus from '../components/DataStatus';

const QuestionBank = ({ questions, loading, error }) => {
  const [level, setLevel] = useState('all');
  const [query, setQuery] = useState('');

  const handleQueryShift = (e) => setQuery(e.target.value);

  if (loading || error) return <DataStatus loading={loading} error={error} />;

  const filtered = questions
    .filter((q) => level === 'all' || q.level === Number(level))
    .filter((q) => q.question.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>
      <div className="filters">
        <label>
          Mức độ:{' '}
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="all">Tất cả</option>
            {Object.entries(LEVELS).map(([value, name]) => (
              <option key={value} value={value}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          Tìm kiếm:{' '}
          <input type="text" value={query} onChange={handleQueryShift}
                 placeholder="Nhập nội dung câu hỏi..." />
        </label>
      </div>
      <p>Có {filtered.length} câu hỏi</p>
      <table>
        <thead>
          <tr><th>STT</th><th>Mức độ</th><th>Câu hỏi</th></tr>
        </thead>
        <tbody>
          {filtered.map((q, index) => (
            <tr key={q.id}>
              <td>{index + 1}</td>
              <td>{LEVELS[q.level]}</td>
              <td><Link to={`/questions/${q.id}`}>{q.question}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;