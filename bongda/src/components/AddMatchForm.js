import { useReducer, useRef } from 'react';
import { ROUNDS, TEAMS } from '../data';
import { isValidGoals } from '../utils';

const initial = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };
function reducer(state, action) {
  if (action.type === 'change') return { ...state, [action.field]: action.value };
  if (action.type === 'reset') return initial;
  return state;
}
export default function AddMatchForm({ matches, onAdd }) {
  const [form, dispatch] = useReducer(reducer, initial);
  const homeRef = useRef(null);
  const [errors, setErrors] = useReducer((state, next) => next, {});
  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.home) next.home = 'Hãy chọn đội nhà';
    if (!form.away) next.away = 'Hãy chọn đội khách';
    if (form.home && form.away && form.home === form.away) next.away = 'Hai đội phải khác nhau';
    else if (form.home && form.away && matches.some((match) => (match.home === Number(form.home) && match.away === Number(form.away)) || (match.home === Number(form.away) && match.away === Number(form.home)))) next.away = 'Hai đội đã đá với nhau rồi';
    if (form.homeGoals === '' || form.awayGoals === '' || !isValidGoals(form.homeGoals) || !isValidGoals(form.awayGoals)) next.goals = 'Số bàn thắng phải là số nguyên từ 0 đến 20';
    setErrors(next);
    if (Object.keys(next).length) return;
    onAdd({ round: Number(form.round), home: Number(form.home), away: Number(form.away), homeGoals: Number(form.homeGoals), awayGoals: Number(form.awayGoals) });
    dispatch({ type: 'reset' }); homeRef.current?.focus();
  };
  const change = (field) => (event) => dispatch({ type: 'change', field, value: event.target.value });
  return <form className="panel add-form" onSubmit={submit}>
    <div className="section-heading"><div><span className="eyebrow">CẬP NHẬT GIẢI ĐẤU</span><h2>Thêm trận đấu</h2></div><span className="goal-mark">＋</span></div>
    <div className="form-grid match-form-grid">
      <label>Vòng<select value={form.round} onChange={change('round')}>{ROUNDS.map((round) => <option key={round} value={round}>Vòng {round}</option>)}</select></label>
      <label>Đội nhà<select ref={homeRef} value={form.home} onChange={change('home')}><option value="">-- Chọn đội --</option>{TEAMS.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select>{errors.home && <small className="field-error">{errors.home}</small>}</label>
      <label>Đội khách<select value={form.away} onChange={change('away')}><option value="">-- Chọn đội --</option>{TEAMS.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}</select>{errors.away && <small className="field-error">{errors.away}</small>}</label>
      <label>Bàn thắng đội nhà<input type="number" min="0" max="20" value={form.homeGoals} onChange={change('homeGoals')} />{errors.goals && <small className="field-error">{errors.goals}</small>}</label>
      <label>Bàn thắng đội khách<input type="number" min="0" max="20" value={form.awayGoals} onChange={change('awayGoals')} /></label>
    </div><button className="primary-button" type="submit">Thêm trận đấu <span>↗</span></button>
  </form>;
}
