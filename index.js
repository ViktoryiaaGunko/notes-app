const colors = {
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    PURPLE: 'purple',
};

//массив с моковыми объектами
const MOCK_NOTES = [
    {
        id: 1,
        title: 'Изучение JS',
        content: 'Начинаем изучать основы. Углубляемся.',
        color: 'yellow',
        isFavorite: true,
    },
    {
        id: 2,
        title: 'Изучение CSS, HTML',
        content: 'Повторяем изученное.',
        color: 'green',
        isFavorite: false,
    },
    {
        id: 3,
        title: 'Изучение React',
        content: 'После изучения JS переходим к React.',
        color: 'blue',
        isFavorite: false,
    },
];

const model = {
    notes: JSON.parse(localStorage.getItem('notes')) || MOCK_NOTES, // массив данных (.parse)
    //notes: MOCK_NOTES,
    isShowOnlyFavorite: false,

    // добавление новой заметки
    addNote(title, content, color) {
        const note = {
            id: Date.now(),
            title: title,
            content: content,
            color: color,
            isFavorite: false,
        }

        // новая заметка в начало списка
        this.notes.unshift(note)

        // сброс фильтра при новой заметке
        this.isShowOnlyFavorite = false
        // сброс галочки при новой заметке
        const favCheck = document.querySelector('.selected-checkbox')
        if(favCheck) favCheck.checked=false

        this.save()
        // перерисовка страницы
        this.updateNotes(note)
    },

    // перерисовка страницы с новой заметкой
    updateNotes(){
        const notesToRender = this.isShowOnlyFavorite ? this.notes.filter( note => note.isFavorite) : this.notes;
        view.renderNotes(notesToRender);
        // счетчик для всех заметок не только для избранных
        view.renderNotesCount(this.notes);
    },

    deleteNote(noteId){
        this.notes=this.notes.filter(note => note.id!==noteId)

        const hasFav = this.notes.some(note => note.isFavorite)
        // если нет ни одной избранной заметки и нажата кнопка показа только избранных
        if(!hasFav && this.isShowOnlyFavorite){
            // сброс фильтра при новой заметке
            this.isShowOnlyFavorite = false
            // сброс галочки при новой заметке
            const favCheck = document.querySelector('.selected-checkbox')
            if(favCheck) favCheck.checked=false
        }
        this.save()
        this.updateNotes()
    },

    toggleFavorite(noteId){
        const note = this.notes.find(note => noteId===note.id)
        if(note){
            note.isFavorite=!note.isFavorite
        }
        this.save()
        this.updateNotes()
    },

    toggleFilter(){
        this.isShowOnlyFavorite=!this.isShowOnlyFavorite
        this.updateNotes()
    },

    save(){
        localStorage.setItem('notes', JSON.stringify(this.notes))
    }
};

const view = {
    init() {
        const form = document.querySelector('[name="note-form"]')

        form.addEventListener('submit', (event) => {
            // отмена перезагрузки страницы
            event.preventDefault()

            // получаем данные из полей формы
            const title =form.elements['note-title'].value
            const content = form.elements['note-description'].value
            const color =form.elements['color'].value

            // передаем данные в контроллер
            controller.addNote(title, content, color)

            // очистка формы
            form.reset()
        })

        const gridNotes = document.getElementById('notes-grid')
        gridNotes.addEventListener('click', (event) => {
            const trashButton = event.target.closest('.trash-note-button')
            if (trashButton) {
                const card = trashButton.closest('.note-card')
                /* id в число */
                const id = Number(card.dataset.id)
                controller.deleteNote(id)
            }
        })
        gridNotes.addEventListener('click', (event)=>{
            const likeButton = event.target.closest('.like-note-button')
            if(likeButton){
                const card =likeButton.closest('.note-card')
                const id=Number(card.dataset.id)
                controller.toggleFavorite(id)
            }
        })

        const showFavorite = document.querySelector('.selected-checkbox')
        showFavorite.addEventListener('change', ()=> controller.toggleFilter())

        this.renderNotes(model.notes);
        this.renderNotesCount(model.notes);
    },

    renderNotes(notes) {
        const emptyState = document.getElementById('empty-state')
        const gridState = document.getElementById('notes-grid')
        const messShowFav = document.getElementById('notes-controls')

        if (!model.notes.length) {
            emptyState.classList.remove('hidden')
            gridState.classList.add('hidden')
            messShowFav.classList.add('hidden')
        } else {
            emptyState.classList.add('hidden')
            gridState.classList.remove('hidden')
            messShowFav.classList.remove('hidden')

            //рендер карточек
            const notesHTML = notes.map(note => {
                return `<div class="note-card" data-id="${note.id}" data-color="${note.color}">
                <div class="wrapper-note-header">
                <h2 >${note.title}</h2>
                <div class="wrapper-note-buttons">
                  <button type="button" class="like-note-button" aria-label="Добавить в избранное">
                  <!-- здесь может быть иконка обычного или активного сердца -->
                    <img src="./images/icons/${note.isFavorite ? 'heart-active.png' : 'heart-inactive.png'}" alt="">
                  </button>
                  <button type="button" class="trash-note-button" aria-label="Удалить заметку">
                    <img src="./images/icons/trash.png" alt="">
                  </button>
                </div>
              </div>
            <div class="note-text">
              <div class="wrapper-note-text">
                <p>${note.content}</p>
              </div>
            </div>
          </div>`;
            }).join('');

            gridState.innerHTML= notesHTML;
        }
    },

    renderNotesCount(notes){
        const notesCount = document.getElementById('notes-count');
        notesCount.innerText=notes.length;
    },

    renderMessage(type, message) {
        let messageBlock;
        if (type==='error'){
            messageBlock=document.getElementById('error-message')
        } else {
            messageBlock= document.getElementById('success-message')
        }
        const textMessage = messageBlock.querySelector('.message-about-new-note')
        if (textMessage) textMessage.innerText= message

        messageBlock.classList.remove('hidden')
        setTimeout(()=>{
            messageBlock.classList.add('hidden')
        }, 3000)
    }
};

const controller ={
    addNote(title, content, color){
        if(title.length > 50){
            view.renderMessage('error', "Название слишком длинное.")
            return
        }
        if(title.trim().length===0 || content.trim().length===0){
            view.renderMessage('error', "Заполните поля.")
            return
        }

        // вызываем метод модели
        model.addNote(title, content, color)
        // вызываем метод view, реализацию которого вам нужно будет добавить
        view.renderMessage('success','Заметка добавлена')
    },

    deleteNote(noteId){
        model.deleteNote(noteId)
        view.renderMessage('success','Заметка удалена')
    },

    toggleFavorite(noteId) {
        model.toggleFavorite(noteId)
    },

    toggleFilter(){
        model.toggleFilter()
    }
};

view.init();
