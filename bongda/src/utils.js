import { MAX_GOALS, POINTS, TEAMS } from './data';

export const getTeamName = (id) => TEAMS.find((team) => team.id === Number(id))?.name || 'Không rõ đội';
export const getResult = (match) => match.homeGoals > match.awayGoals ? 'home' : match.homeGoals < match.awayGoals ? 'away' : 'draw';
export const isValidGoals = (n) => Number.isInteger(Number(n)) && Number(n) >= 0 && Number(n) <= MAX_GOALS;

export function calcStandings(matches) {
  const rows = TEAMS.map((team) => ({ ...team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, diff: 0, points: 0 }));
  const byId = Object.fromEntries(rows.map((row) => [row.id, row]));
  matches.forEach((match) => {
    const home = byId[match.home]; const away = byId[match.away];
    if (!home || !away) return;
    const result = getResult(match);
    home.played += 1; away.played += 1;
    home.gf += match.homeGoals; home.ga += match.awayGoals;
    away.gf += match.awayGoals; away.ga += match.homeGoals;
    if (result === 'home') { home.won += 1; away.lost += 1; home.points += POINTS.win; }
    else if (result === 'away') { away.won += 1; home.lost += 1; away.points += POINTS.win; }
    else { home.drawn += 1; away.drawn += 1; home.points += POINTS.draw; away.points += POINTS.draw; }
  });
  return rows.map((row) => ({ ...row, diff: row.gf - row.ga }))
    .sort((a, b) => b.points - a.points || b.diff - a.diff || b.gf - a.gf || a.name.localeCompare(b.name, 'vi'));
}

export function calcMatchStats(matches) {
  const counts = matches.reduce((all, match) => {
    all.goals += match.homeGoals + match.awayGoals;
    all[getResult(match)] += 1;
    return all;
  }, { goals: 0, home: 0, draw: 0, away: 0 });
  return { count: matches.length, ...counts, average: matches.length ? Math.round((counts.goals / matches.length) * 100) / 100 : 0 };
}

export function calcNeeded(standings, teamId, target, remaining) {
  const row = standings.find((team) => team.id === Number(teamId));
  const t = Number(target); const r = Number(remaining);
  if (!row || !Number.isInteger(t) || t < 0 || !Number.isInteger(r) || r < 1) return { status: 'invalid' };
  const need = t - row.points;
  if (need <= 0) return { status: 'done' };
  if (need > 3 * r) return { status: 'impossible' };
  return { status: 'possible', need, wins: Math.max(0, Math.ceil((need - r) / 2)) };
}
