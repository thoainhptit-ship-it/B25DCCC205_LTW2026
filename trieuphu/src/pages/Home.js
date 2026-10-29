import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() === '') return;
    navigate('/play');
  };

  return (
    <div>
      <h2>Ai là triệu phú</h2>
      <ul>
        <li>Trả lời lần lượt 15 câu hỏi trắc nghiệm, mỗi câu có 30 giây.</li>
        <li>Trả lời đúng thì leo lên bậc tiền thưởng tiếp theo, câu 15 trị giá 250.000.000 đ.</li>
        <li>Câu 5, 10, 15 là các mốc an toàn. Trả lời sai hoặc hết giờ thì chỉ nhận tiền của mốc cao nhất đã vượt qua.</li>
      </ul>
      <form onSubmit={handleSubmit}>
        <label>
          Tên người chơi:{' '}
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nhập tên của bạn"
          />
        </label>{' '}
        <button type="submit" disabled={playerName.trim() === ''}>Bắt đầu</button>
      </form>
    </div>
  );
};

export default Home;