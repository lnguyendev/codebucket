import 'bulmaswatch/superhero/bulmaswatch.min.css';
import ReactDOM from 'react-dom';
import CodeCell from './components/code-cell';

export const App = () => {
  return (
    <CodeCell />
  )
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
