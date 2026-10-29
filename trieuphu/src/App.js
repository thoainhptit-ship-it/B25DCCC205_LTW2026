const BUILD_TAG = "tp-4186";
/* eslint-disable import/first */
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('/data/questions.json', { signal: controller.signal });
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) return; // request bị hủy thì bỏ qua
        setError(true);
        setLoading(false);
      }
    };
    fetchQuestions();
    return () => controller.abort();
  }, []);

  const status = { questions, loading, error };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={<Home playerName={playerName} setPlayerName={setPlayerName} />}
        />
        <Route path="play" element={<Play {...status} playerName={playerName} />} />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<h2>Lịch sử các lượt chơi</h2>} />
        <Route path="questions" element={<QuestionBank {...status} />} />
        <Route path="questions/:id" element={<QuestionDetail {...status} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;