import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROUNDS, TEAMS, formatDiff } from './data';
import { addMatch, removeMatch, selectMatches, setGoals, setMatches } from './features/matchesSlice';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import useFetch from './hooks/useFetch';
import useDebounce from './hooks/useDebounce';
import useLocalStorage from './hooks/useLocalStorage';
import { loadSaved, saveMatches } from './storage';
import { calcMatchStats, calcStandings, getTeamName } from './utils';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';
import MatchRow from './components/MatchRow';
import StandingsTable from './components/StandingsTable';

export default function App() {
  const dispatch = useDispatch(); const matches = useSelector(selectMatches);
  const { theme, toggleTheme } = useTheme(); const showNotice = useNotice();
  const saved = useMemo(() => loadSaved(), []);
  const { data: sample, loading, error } = useFetch(saved === null ? '/data/matches.json' : null);
  const [ready, setReady] = useState(false);
  const [round, setRound] = useLocalStorage('ltw_bongda_round', 'all');
  const [search, setSearch] = useState(''); const debouncedSearch = useDebounce(search, 300);
  useEffect(() => {
    if (saved !== null) { dispatch(setMatches(saved)); setReady(true); }
    else if (sample) { dispatch(setMatches(sample)); saveMatches(sample); setReady(true); }
    else if (error) { showNotice('Không tải được lịch thi đấu'); }
  }, [saved, sample, error, dispatch, showNotice]);
  useEffect(() => { if (ready) saveMatches(matches); }, [matches, ready]);

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const allStats = useMemo(() => calcMatchStats(matches), [matches]);
  const roundMatches = useMemo(() => matches.filter((match) => round === 'all' || match.round === Number(round)), [matches, round]);
  const viewed = useMemo(() => roundMatches.filter((match) => !debouncedSearch || `${getTeamName(match.home)} ${getTeamName(match.away)}`.toLocaleLowerCase('vi').includes(debouncedSearch.toLocaleLowerCase('vi'))), [roundMatches, debouncedSearch]);
  const visibleStats = useMemo(() => calcMatchStats(roundMatches), [roundMatches]);
  const leader = standings[0];
  const onGoals = useCallback((id, homeGoals, awayGoals) => dispatch(setGoals({ id, homeGoals, awayGoals })), [dispatch]);
  const onRemove = useCallback((id, home, away) => {
    dispatch(removeMatch(id));
    showNotice(`Đã xóa trận ${getTeamName(home)} – ${getTeamName(away)}`);
  }, [dispatch, showNotice]);
  const onAdd = useCallback((value) => {
    const match = { ...value, id: Math.max(0, ...matches.map((item) => item.id)) + 1 };
    dispatch(addMatch(match)); showNotice(`Đã thêm trận ${getTeamName(match.home)} – ${getTeamName(match.away)}`);
  }, [dispatch, matches, showNotice]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) { event.preventDefault(); document.getElementById('team-search')?.focus(); }
      if (event.key === 'Escape' && document.activeElement?.id === 'team-search') { setSearch(''); document.activeElement.blur(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
  useEffect(() => { document.title = leader ? `${leader.name} dẫn đầu – Giải bóng đá khoa` : 'Giải bóng đá khoa'; }, [leader]);

  const resetData = async () => {
    try {
      const response = await fetch('/data/matches.json');
      if (!response.ok) throw new Error('Request failed');
      const initialMatches = await response.json();
      dispatch(setMatches(initialMatches)); showNotice('Đã đặt lại dữ liệu mẫu');
    } catch { showNotice('Không tải được dữ liệu mẫu'); }
  };
  const rankText = (team) => team ? `${team.name} (${team.points} điểm)` : '—';

  return <div className={`app ${theme}`} data-build="TH03B">
    <div className="topline"><span><i /> MÙA GIẢI 2026</span><span>GIẢI NỘI BỘ · 06 ĐỘI</span></div>
    <header className="hero">
      <div className="hero-copy"><span className="eyebrow light">SÂN CỎ · ĐAM MÊ · ĐỒNG ĐỘI</span><h1>Giải bóng đá<br /><em>các khoa</em></h1><p>Theo dõi từng vòng đấu. Cùng nhau tạo nên mùa giải đáng nhớ.</p>
        <div className="hero-actions"><a href="#lich-thi-dau" className="hero-link">Khám phá giải đấu <span>↓</span></a><button className="theme-toggle" onClick={toggleTheme} aria-label="Đổi chế độ sáng tối">{theme === 'light' ? '☾' : '☀'} <span>Chế độ {theme === 'light' ? 'tối' : 'sáng'}</span></button></div>
      </div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="ball">⚽</div><span className="art-tag">PLAY<br />TOGETHER</span><span className="hero-number">03</span></div>
      <div className="hero-meta"><span>01 — 05 VÒNG ĐẤU</span><span>ROUND ROBIN · MỘT LƯỢT</span></div>
    </header>
    <main>
      <section className="stats-strip" aria-label="Tổng quan giải đấu">
        <div><span className="stat-label">SỐ TRẬN</span><strong>{allStats.count}<small> trận</small></strong><span className="stat-note">Đã diễn ra</span></div>
        <div><span className="stat-label">TỔNG BÀN THẮNG</span><strong>{allStats.goals}</strong><span className="stat-note">Trên toàn giải</span></div>
        <div><span className="stat-label">BÀN MỖI TRẬN</span><strong>{allStats.average.toFixed(2)}</strong><span className="stat-note">Trung bình</span></div>
        <div className="leader-stat"><span className="stat-label">ĐỘI DẪN ĐẦU</span><strong>{rankText(leader)}</strong><span className="stat-note">Theo bảng xếp hạng</span></div>
      </section>
      <div className="content-grid">
        <section className="panel standings-panel" id="bang-xep-hang">
          <div className="section-heading"><div><span className="eyebrow">BẢNG ĐIỂM MÙA GIẢI</span><h2>Bảng xếp hạng</h2></div><span className="section-index">01 / 03</span></div>
          <StandingsTable standings={standings} /><div className="table-foot"><span>HS — Hiệu số · BT — Bàn thắng</span><span>Cập nhật trực tiếp <i /></span></div>
        </section>
        <aside className="side-stack"><GoalPlanner standings={standings} />
          <section className="panel distribution"><div className="section-heading"><div><span className="eyebrow">VÒNG ĐANG XEM</span><h2>Phân bố kết quả</h2></div><span className="round-badge">{round === 'all' ? 'Tất cả' : `Vòng ${round}`}</span></div>
            {[['home', 'Đội nhà thắng', visibleStats.home], ['draw', 'Hòa', visibleStats.draw], ['away', 'Đội khách thắng', visibleStats.away]].map(([key, label, count]) => <div className="distribution-row" key={key}><div><span>{label}</span><b>{count}</b></div><div className="bar-track"><span className={`bar-${key}`} style={{ width: `${viewed.length ? (count / viewed.length) * 100 : 0}%` }} /></div></div>)}
            <p className="distribution-total">{visibleStats.count} trận · {visibleStats.goals} bàn thắng</p>
          </section>
        </aside>
      </div>
      <section className="panel schedule-panel" id="lich-thi-dau">
        <div className="section-heading schedule-heading"><div><span className="eyebrow">LỊCH THI ĐẤU & KẾT QUẢ</span><h2>Trên sân cỏ</h2></div><span className="section-index">02 / 03</span></div>
        <div className="schedule-tools"><div className="round-tabs" aria-label="Lọc theo vòng"><button className={round === 'all' ? 'active' : ''} onClick={() => setRound('all')}>Tất cả vòng</button>{ROUNDS.map((item) => <button key={item} className={Number(round) === item ? 'active' : ''} onClick={() => setRound(String(item))}>Vòng {item}</button>)}</div>
          <label className="search-box"><span>⌕</span><input id="team-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm đội..." /><kbd>/</kbd></label></div>
        <p className="search-count">Tìm thấy {viewed.length} trận</p>
        <div className="table-wrap match-table-wrap"><table className="match-table"><thead><tr><th>Vòng</th><th>Đội nhà</th><th>BT nhà</th><th>BT khách</th><th>Đội khách</th><th>Kết quả</th><th>Số lần render</th><th>Xóa</th></tr></thead><tbody>
          {loading && !ready ? <tr><td colSpan="8" className="empty-state">Đang tải lịch thi đấu...</td></tr> : error && !ready ? <tr><td colSpan="8" className="empty-state">Không tải được lịch thi đấu.</td></tr> : viewed.length ? viewed.map((match) => <MatchRow key={match.id} match={match} onGoals={onGoals} onRemove={onRemove} />) : <tr><td colSpan="8" className="empty-state">{matches.length ? 'Không tìm thấy trận phù hợp.' : 'Chưa có trận đấu nào'}</td></tr>}
        </tbody></table></div><div className="schedule-footer"><span>Điều chỉnh tỉ số trực tiếp trên bảng</span><button className="text-button" onClick={resetData}>↻ Đặt lại dữ liệu mẫu</button></div>
      </section>
      <div className="bottom-grid"><AddMatchForm matches={matches} onAdd={onAdd} />
        <section className="closing-card"><span className="eyebrow light">MÙA GIẢI CỦA CHÚNG TA</span><div className="closing-ball">⚽</div><h2>Trận đấu đẹp<br />bắt đầu từ <em>đồng đội.</em></h2><p>Mỗi bàn thắng là một câu chuyện. Mỗi vòng đấu là một cơ hội mới.</p><span className="section-index">03 / 03</span></section>
      </div>
      <footer><span>GIẢI BÓNG ĐÁ CÁC KHOA · 2026</span><span>THI ĐẤU HẾT MÌNH, TÔN TRỌNG LẪN NHAU.</span></footer>
    </main>
  </div>;
}
