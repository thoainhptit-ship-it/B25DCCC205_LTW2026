import { PRIZES, MILESTONES } from './data';

// reason: "win" | "wrong" | "timeout" | "stop"
export const calcPrize = (correctCount, reason) => {
  // Thắng hoặc dừng cuộc chơi: nhận tiền của câu vừa đúng gần nhất
  if (reason === 'win' || reason === 'stop') {
    return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  }
  // Sai hoặc hết giờ: chỉ nhận tiền mốc an toàn cao nhất đã vượt qua
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length > 0 ? PRIZES[Math.max(...passed) - 1] : 0;
};