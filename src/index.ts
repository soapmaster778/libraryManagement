import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import './styles/main.scss';
import { renderApp } from './ui/render';

const root = document.querySelector<HTMLElement>('#app');

if (!root) {
  throw new Error('App root was not found.');
}

renderApp(root);
