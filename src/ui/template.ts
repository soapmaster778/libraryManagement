export const appTemplate = `<main class="container py-4">
  <div class="d-none" data-notification></div>
  <header class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
    <div><h1>Library Management</h1><p class="text-secondary mb-0">Облік книг і користувачів</p></div>
    <input class="form-control search" type="search" placeholder="Пошук книги" data-search>
  </header>
  <section class="row g-3 mb-3">
    <div class="col-md-6"><div class="card card-body"><h2>Нова книга</h2>
      <form class="form-grid" data-book-form><div class="d-none" data-errors></div>
        <input class="form-control" name="title" placeholder="Назва"><input class="form-control" name="author" placeholder="Автор">
        <input class="form-control" name="year" type="number" placeholder="Рік"><button class="btn btn-primary">Додати книгу</button>
      </form></div></div>
    <div class="col-md-6"><div class="card card-body"><h2>Новий користувач</h2>
      <form class="form-grid" data-user-form><div class="d-none" data-errors></div>
        <input class="form-control" name="id" placeholder="ID"><input class="form-control" name="name" placeholder="Ім'я">
        <button class="btn btn-primary">Додати користувача</button>
      </form></div></div>
  </section>
  <section class="row g-3">
    <div class="col-lg-6"><div class="card card-body"><h2>Книги</h2><div class="item-list" data-books></div>
      <div class="pager"><button class="btn btn-sm btn-outline-primary" data-book-prev>Назад</button><span data-book-page></span><button class="btn btn-sm btn-outline-primary" data-book-next>Далі</button></div>
    </div></div>
    <div class="col-lg-6"><div class="card card-body"><h2>Користувачі</h2><div class="item-list" data-users></div>
      <div class="pager"><button class="btn btn-sm btn-outline-primary" data-user-prev>Назад</button><span data-user-page></span><button class="btn btn-sm btn-outline-primary" data-user-next>Далі</button></div>
    </div></div>
  </section>
</main>
<div class="modal fade" id="info-modal" tabindex="-1"><div class="modal-dialog"><div class="modal-content">
  <div class="modal-header"><h2 class="modal-title fs-5" data-modal-title></h2><button class="btn-close" data-bs-dismiss="modal"></button></div>
  <div class="modal-body" data-modal-text></div><div class="modal-footer"><button class="btn btn-primary" data-bs-dismiss="modal">Добре</button></div>
</div></div></div>
<div class="modal fade" id="borrow-modal" tabindex="-1"><div class="modal-dialog"><div class="modal-content">
  <div class="modal-header"><h2 class="modal-title fs-5">Позичити книгу</h2><button class="btn-close" data-bs-dismiss="modal"></button></div>
  <div class="modal-body"><select class="form-select" data-borrow-user></select></div>
  <div class="modal-footer"><button class="btn btn-primary" data-borrow-confirm>Підтвердити</button></div>
</div></div></div>`;
