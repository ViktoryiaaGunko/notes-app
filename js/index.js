const colors = {
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    PURPLE: 'purple',
}
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
        id: 1,
        title: 'Изучение React',
        content: 'После изучения JS переходим к React.',
        color: 'blue',
        isFavorite: false,
    },
]

const model = {
    notes: MOCK_NOTES,
}
console.log(model.notes.length)

const view = {
    init() {
        this.renderNotes(model.notes)
    },
    renderNotes(notes) { ... }
}

function init() {
    view.init()
}

init()

/*const controller {

}
*/
