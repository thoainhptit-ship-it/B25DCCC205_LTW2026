import { formatDiff } from '../data';
export default function StandingsTable({ standings }) {
  return <div className="table-wrap"><table><thead><tr><th>Hạng</th><th>Đội</th><th>Trận</th><th>Thắng</th><th>Hòa</th><th>Thua</th><th>BT</th><th>BB</th><th>HS</th><th>Điểm</th></tr></thead>
    <tbody>{standings.map((team, index) => <tr key={team.id} className={index === standings.length - 1 ? 'last-place' : ''}>
      <td>{index + 1}</td><td className="team-name">{team.name}</td><td>{team.played}</td><td>{team.won}</td><td>{team.drawn}</td><td>{team.lost}</td><td>{team.gf}</td><td>{team.ga}</td><td>{formatDiff(team.diff)}</td><td className="points">{team.points}</td>
    </tr>)}</tbody></table></div>;
}
