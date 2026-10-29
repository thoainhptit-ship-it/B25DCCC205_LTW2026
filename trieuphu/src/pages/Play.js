import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PRIZES, TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';
import DataStatus from '../components/DataStatus';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';

const Game = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0); // vị trí câu hiện tại (0-14)
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const question = questions[index];

  const finish = (reason, correctCount) => {
    navigate('/result', {
      replace: true,
      state: {
        name: playerName,
        prize: calcPrize(correctCount, reason),
        correctCount,
        reason,
      },
    });
  };

  // Đồng hồ: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== 'answering') return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status, index]);

  // Hết giờ = trả lời sai
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) {
      finish('timeout', index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, status]);

  // Các bước chờ: locked -> (1 giây) revealed -> (2 giây) câu tiếp / kết thúc
  useEffect(() => {
    if (status === 'locked') {
      const id = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(id);
    }
    if (status === 'revealed') {
      const id = setTimeout(() => {
        if (selected !== question.answer) {
          finish('wrong', index);
        } else if (index === PRIZES.length - 1) {
          finish('win', PRIZES.length);
        } else {
          setIndex(index + 1);
          setSelected(null);
          setTimeLeft(TIME_PER_QUESTION);
          setStatus('answering');
        }
      }, 2000);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSelect = (optionIndex) => {
    if (status !== 'answering') return;
    setSelected(optionIndex);
    setStatus('locked');
  };

  return (
    <div className="play">
      <div className="play-main">
        <Timer seconds={timeLeft} />
        <QuestionCard
          number={index + 1}
          total={PRIZES.length}
          question={question}
          selected={selected}
          status={status}
          onSelect={handleSelect}
        />
      </div>
      <MoneyLadder current={index + 1} />
    </div>
  );
};

const Play = ({ questions, loading, error, playerName }) => {
  if (!playerName) return <Navigate to="/" replace />;
  if (loading || error) return <DataStatus loading={loading} error={error} />;
  return <Game questions={questions} playerName={playerName} />;
};

export default Play;