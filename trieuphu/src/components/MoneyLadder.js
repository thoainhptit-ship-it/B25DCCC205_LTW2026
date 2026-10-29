import { PRIZES, MILESTONES, formatMoney } from '../data';

const MoneyLadder = ({ current }) => (
  <ul className="ladder">
    {PRIZES.map((prize, index) => ({ prize, number: index + 1 }))
      .reverse()
      .map(({ prize, number }) => (
        <li
          key={number}
          className={`${number === current ? 'active' : ''} ${
            MILESTONES.includes(number) ? 'milestone' : ''
          }`}
        >
          {number}. {formatMoney(prize)}
        </li>
      ))}
  </ul>
);

export default MoneyLadder;