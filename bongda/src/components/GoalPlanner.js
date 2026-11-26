import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TEAMS } from '../data';
import { setRemaining, setTarget, setTeamId } from '../features/goalSlice';
import { calcNeeded } from '../utils';
export default function GoalPlanner({ standings }) {
  const dispatch = useDispatch(); const goal = useSelector((state) => state.goal);
  const result = useMemo(() => calcNeeded(standings, goal.teamId, goal.target, goal.remaining), [standings, goal]);
  const message = result.status === 'invalid' ? 'Hãy chọn đội, nhập số điểm mục tiêu (từ 0) và số trận còn lại (từ 1)'
    : result.status === 'done' ? 'Đội đã đạt mục tiêu'
      : result.status === 'impossible' ? 'Không thể đạt mục tiêu này'
        : `Cần thêm ${result.need} điểm ở ${goal.remaining} trận còn lại, tối thiểu ${result.wins} trận thắng`;
  return <section className="panel goal-panel" id="muc-tieu"><div className="section-heading"><div><span className="eyebrow">KẾ HOẠCH MÙA GIẢI</span><h2>Mục tiêu điểm</h2></div><span className="goal-mark">✳</span></div>
    <div className="form-grid goal-grid">
      <label>Đội bóng<select value={goal.teamId} onChange={(e) => dispatch(setTeamId(e.target.value))}>{TEAMS.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select></label>
      <label>Điểm mục tiêu<input type="number" min="0" value={goal.target} onChange={(e) => dispatch(setTarget(e.target.value))} /></label>
      <label>Trận còn lại<input type="number" min="1" value={goal.remaining} onChange={(e) => dispatch(setRemaining(e.target.value))} /></label>
    </div><p className={`goal-result ${result.status}`} role="status">{message}</p>
  </section>;
}
