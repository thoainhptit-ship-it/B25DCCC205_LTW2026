import React, { useRef } from 'react';
import { RESULT_LABELS } from '../data';
import { getResult, getTeamName, isValidGoals } from '../utils';
function MatchRow({ match, onGoals, onRemove }) {
  const renders = useRef(0); renders.current += 1;
  const result = getResult(match);
  const update = (side, raw) => { if (raw !== '' && isValidGoals(raw)) onGoals(match.id, side === 'home' ? Number(raw) : match.homeGoals, side === 'away' ? Number(raw) : match.awayGoals); };
  return <tr className={result === 'draw' ? 'draw-row' : ''}>
    <td>{match.round}</td><td>{getTeamName(match.home)}</td>
    <td><input aria-label={`Bàn thắng nhà ${getTeamName(match.home)} - ${getTeamName(match.away)}`} type="number" min="0" max="20" value={match.homeGoals} onChange={(e) => update('home', e.target.value)} /></td>
    <td><input aria-label={`Bàn thắng khách ${getTeamName(match.home)} - ${getTeamName(match.away)}`} type="number" min="0" max="20" value={match.awayGoals} onChange={(e) => update('away', e.target.value)} /></td>
    <td>{getTeamName(match.away)}</td><td>{RESULT_LABELS[result]}</td><td><span className="render-count">{renders.current}</span></td>
    <td><button className="icon-button danger" onClick={() => onRemove(match.id, match.home, match.away)} aria-label="Xóa trận đấu">×</button></td>
  </tr>;
}
export default React.memo(MatchRow);
