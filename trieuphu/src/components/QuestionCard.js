import AnswerButton from './AnswerButton';
import { LETTERS } from '../data';

const QuestionCard = ({ number, total, question, selected, status, onSelect }) => {
  const getState = (index) => {
    if (status === 'locked') return index === selected ? 'selected' : '';
    if (status === 'revealed') {
      if (index === question.answer) return 'correct';
      if (index === selected) return 'wrong';
    }
    return '';
  };

  return (
    <div className="question-card">
      <p className="question-number">Câu {number}/{total}</p>
      <h3>{question.question}</h3>
      <div className="answers">
        {question.options.map((option, index) => (
          <AnswerButton
            key={index}
            letter={LETTERS[index]}
            text={option}
            state={getState(index)}
            disabled={status !== 'answering'}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;