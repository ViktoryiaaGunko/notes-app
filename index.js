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
    notes: MOCK_NOTES,

    // добавление новой заметки
    addNote(title, content, color) {
        const note = {
            id: Date.now(),
            title: title,
            content: content,
            color: color,
            isFavorite: false,
        };

        // новая заметка в начало списка
        this.notes.unshift(note);

        // перерисовка страницы
        this.updateNotes(note);
    },

    // перерисовка страницы с новой заметкой
    updateNotes(){
        view.renderNotes(this.notes);
        view.renderNotesCount(this.notes);
    }
};
// console.log(model.notes.length);

const view = {
    init() {
        const form = document.querySelector('.note-form')
        form.addEventListener('submit', (event) => {
            // отмена перезагрузки страницы
            event.preventDefault()

            // получаем данные из полей формы
            const title =form.elements['note-title'].value
            const content = form.elements['note-description'].value
            const color =form.elements['color'].value

            // передаем данные в контроллер
            controller.addNote(title, content, color)
        })

        this.renderNotes(model.notes);
        this.renderNotesCount(model.notes);
    },

    renderNotes(notes) {
        const emptyState = document.getElementById('empty-state');
        const gridState = document.getElementById('notes-grid');

        if (!notes.length) {
            emptyState.classList.remove('hidden');
            gridState.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            gridState.classList.remove('hidden');

            //рендер карточек
            const notesHTML = notes.map(note => {
                return `<div class="note-card" data-id="${note.id}" data-color="${note.color}">
                <div class="wrapper-note-header">
                <h2 >${note.title}</h2>
                <div class="wrapper-note-buttons">
                  <button type="button" class="like-note-button" aria-label="Добавить в избранное">
                  <!-- здесь может быть иконка обычного или активного сердца -->
                    <img src="./images/icons/${heartIcon}" alt="">
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
        const textMessage = messageBlock.getElementsByClassName('message-about-new-note')
        if (textMessage) textMessage.innerText= message

        messageBlock.classList.remove('hidden')
        setTimeout(()=>{
            messageBlock.classList.add('hidden')
        }, 3000)
    }
};


view.init();

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
    }

};