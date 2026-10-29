const Timer = ({ seconds }) => (
  <p className={`timer ${seconds <= 10 ? 'danger' : ''}`}>Còn {seconds} giây</p>
);

export default Timer;