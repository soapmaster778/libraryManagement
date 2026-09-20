import { Modal } from 'bootstrap';
import { Book } from '../models/Book';
import { User } from '../models/User';
import type { IBook } from '../models/interfaces/IBook';
import type { IUser } from '../models/interfaces/IUser';
import { Library } from '../services/Library';
import { StorageService } from '../services/Storage';
import type { EntityId } from '../types';
import { createId } from '../utils/idGenerator';
import { Validation } from '../utils/validators';
import { appTemplate } from './template';

const PAGE_SIZE = 5;
const bookStorage = new StorageService<IBook>('library-books');
const userStorage = new StorageService<IUser>('library-users');
const books = new Library<Book>(bookStorage.load().map(Book.from));
const users = new Library<User>(userStorage.load().map(User.from));

let bookPage = 1;
let userPage = 1;
let search = '';

const get = <T extends Element>(selector: string): T =>
  document.querySelector<T>(selector)!;

const clean = (text: string): string => {
  const element = document.createElement('div');
  element.textContent = text;
  return element.innerHTML;
};

const save = (): void => {
  bookStorage.save(books.getAll().map((book) => book.toJSON()));
  userStorage.save(users.getAll().map((user) => user.toJSON()));
};

const notify = (text: string, type = 'success'): void => {
  const box = get<HTMLElement>('[data-notification]');
  box.className = `alert alert-${type} notification`;
  box.textContent = text;
  window.setTimeout(() => (box.className = 'd-none'), 3000);
};

const showModal = (title: string, text: string): void => {
  get<HTMLElement>('[data-modal-title]').textContent = title;
  get<HTMLElement>('[data-modal-text]').textContent = text;
  Modal.getOrCreateInstance(get('#info-modal')).show();
};

const showErrors = (form: HTMLFormElement, errors: string[]): void => {
  const box = form.querySelector<HTMLElement>('[data-errors]')!;
  box.className = errors.length ? 'alert alert-danger py-2' : 'd-none';
  box.innerHTML = errors.map((error) => `<div>${clean(error)}</div>`).join('');
};

const pageItems = <T>(items: T[], page: number): T[] =>
  items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

const updatePager = (
  name: 'book' | 'user',
  page: number,
  count: number,
): number => {
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const current = Math.min(page, pages);
  get<HTMLButtonElement>(`[data-${name}-prev]`).disabled = current === 1;
  get<HTMLButtonElement>(`[data-${name}-next]`).disabled = current === pages;
  get<HTMLElement>(`[data-${name}-page]`).textContent = `${current} / ${pages}`;
  return current;
};

const renderBooks = (): void => {
  const query = search.toLowerCase().trim();
  const filtered = books.find(
    (book) =>
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query),
  );
  bookPage = updatePager('book', bookPage, filtered.length);

  get<HTMLElement>('[data-books]').innerHTML =
    pageItems(filtered, bookPage)
      .map((book) => {
        const available = !book.borrowedBy;
        const borrower = book.borrowedBy
          ? (users.findById(book.borrowedBy)?.name ?? book.borrowedBy)
          : '-';

        return `<article class="border rounded p-3">
          <div class="d-flex justify-content-between gap-2">
            <div><strong>${clean(book.title)}</strong><br><small>${clean(book.author)} · ${book.year}</small></div>
            <span class="badge ${available ? 'text-bg-success' : 'text-bg-warning'}">${available ? 'Доступна' : 'Позичена'}</span>
          </div>
          <p class="my-2 text-secondary">Позичив: ${clean(borrower)}</p>
          <button class="btn btn-sm ${available ? 'btn-primary' : 'btn-outline-success'}" data-action="${available ? 'borrow' : 'return'}" data-id="${book.id}">${available ? 'Позичити' : 'Повернути'}</button>
          <button class="btn btn-sm btn-outline-danger" data-action="remove" data-id="${book.id}">Видалити</button>
        </article>`;
      })
      .join('') || '<p class="text-secondary">Книг не знайдено.</p>';
};

const renderUsers = (): void => {
  const allUsers = users.getAll();
  userPage = updatePager('user', userPage, allUsers.length);

  get<HTMLElement>('[data-users]').innerHTML =
    pageItems(allUsers, userPage)
      .map(
        (user) => `<article class="border rounded p-3">
          <strong>${clean(user.name)}</strong>
          <p class="my-2 text-secondary">ID: ${user.id} · Книг: ${user.borrowedBookIds.length}/3</p>
          <button class="btn btn-sm btn-outline-danger" data-id="${user.id}">Видалити</button>
        </article>`,
      )
      .join('') || '<p class="text-secondary">Користувачів ще немає.</p>';
};

const renderAll = (): void => {
  renderBooks();
  renderUsers();
};

const addBook = (form: HTMLFormElement): void => {
  const data = new FormData(form);
  const title = String(data.get('title') ?? '');
  const author = String(data.get('author') ?? '');
  const year = String(data.get('year') ?? '');
  const result = Validation.combine(
    Validation.required(title, 'Назва'),
    Validation.required(author, 'Автор'),
    Validation.publicationYear(year),
  );

  if (!result.valid) return showErrors(form, result.errors);

  books.add(new Book(createId(), title.trim(), author.trim(), Number(year)));
  form.reset();
  showErrors(form, []);
  save();
  notify('Книгу додано.');
  renderBooks();
};

const addUser = (form: HTMLFormElement): void => {
  const data = new FormData(form);
  const id = String(data.get('id') ?? '');
  const name = String(data.get('name') ?? '');
  const result = Validation.combine(
    Validation.userId(id),
    Validation.required(name, "Ім'я користувача"),
  );

  if (!result.valid) return showErrors(form, result.errors);

  try {
    users.add(new User(id.trim(), name.trim()));
  } catch {
    return showErrors(form, ['Користувач з таким ID вже існує.']);
  }

  form.reset();
  showErrors(form, []);
  save();
  notify('Користувача додано.');
  renderUsers();
};

const chooseUser = (bookId: EntityId): void => {
  if (!users.getAll().length)
    return showModal('Помилка', 'Спочатку додайте користувача.');

  const modal = get<HTMLDivElement>('#borrow-modal');
  const select = get<HTMLSelectElement>('[data-borrow-user]');
  select.innerHTML = users
    .getAll()
    .map(
      (user) =>
        `<option value="${user.id}">${clean(user.name)} (${user.borrowedBookIds.length}/3)</option>`,
    )
    .join('');

  get<HTMLButtonElement>('[data-borrow-confirm]').onclick = () => {
    Modal.getOrCreateInstance(modal).hide();
    borrowBook(bookId, select.value);
  };
  Modal.getOrCreateInstance(modal).show();
};

const borrowBook = (bookId: EntityId, userId: EntityId): void => {
  const book = books.findById(bookId);
  const user = users.findById(userId);
  if (!book || !user) return;
  if (user.borrowedBookIds.length === 3)
    return showModal('Ліміт', 'Користувач уже має 3 книги.');

  book.borrow(user.id);
  user.borrowBook(book.id);
  save();
  notify(`Книгу «${book.title}» позичено.`);
  renderAll();
};

const returnBook = (bookId: EntityId): void => {
  const book = books.findById(bookId);
  if (!book?.borrowedBy) return;
  users.findById(book.borrowedBy)?.returnBook(book.id);
  book.returnBook();
  save();
  notify(`Книгу «${book.title}» повернено.`, 'info');
  renderAll();
};

const removeBook = (bookId: EntityId): void => {
  const book = books.findById(bookId);
  if (book?.borrowedBy) users.findById(book.borrowedBy)?.returnBook(book.id);
  books.remove(bookId);
  save();
  renderAll();
};

const removeUser = (userId: EntityId): void => {
  users
    .findById(userId)
    ?.borrowedBookIds.forEach((id) => books.findById(id)?.returnBook());
  users.remove(userId);
  save();
  renderAll();
};

export const renderApp = (root: HTMLElement): void => {
  root.innerHTML = appTemplate;

  get<HTMLFormElement>('[data-book-form]').onsubmit = (event) => {
    event.preventDefault();
    addBook(event.currentTarget as HTMLFormElement);
  };
  get<HTMLFormElement>('[data-user-form]').onsubmit = (event) => {
    event.preventDefault();
    addUser(event.currentTarget as HTMLFormElement);
  };
  get<HTMLInputElement>('[data-search]').oninput = (event) => {
    search = (event.currentTarget as HTMLInputElement).value;
    bookPage = 1;
    renderBooks();
  };
  get<HTMLElement>('[data-books]').onclick = (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      '[data-action]',
    );
    if (!button?.dataset.id) return;
    if (button.dataset.action === 'borrow') chooseUser(button.dataset.id);
    if (button.dataset.action === 'return') returnBook(button.dataset.id);
    if (button.dataset.action === 'remove') removeBook(button.dataset.id);
  };
  get<HTMLElement>('[data-users]').onclick = (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      '[data-id]',
    );
    if (button?.dataset.id) removeUser(button.dataset.id);
  };
  get<HTMLButtonElement>('[data-book-prev]').onclick = () => {
    bookPage -= 1;
    renderBooks();
  };
  get<HTMLButtonElement>('[data-book-next]').onclick = () => {
    bookPage += 1;
    renderBooks();
  };
  get<HTMLButtonElement>('[data-user-prev]').onclick = () => {
    userPage -= 1;
    renderUsers();
  };
  get<HTMLButtonElement>('[data-user-next]').onclick = () => {
    userPage += 1;
    renderUsers();
  };
  renderAll();
};
