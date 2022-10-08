let section = document.getElementById ('section')
let card = document.getElementById ('letter_card')
let button = document.getElementById ('plus_button')
let search_bar = document.getElementById ('search')
let page_indicator = document.getElementById ('page_indicator')
search_bar.oninput = load_cards
button.onclick = onclick
let cards = []
let deleted_cards = []
let is_notes_page = true
let filtered_cards = []
let filtered_deleted_cards = []
function search (){
    let search_term = search_bar.value
    function should_be_filtered (card) {
        if (card.title.includes(search_term)){
            return true
        }else{
            return false
        }
    }
    function add_index (item, index){
        return {...item, index: index}
    }
    filtered_cards = [...cards].map (add_index)
    filtered_deleted_cards = [...deleted_cards].map (add_index)
    filtered_cards = filtered_cards.filter(should_be_filtered);
    filtered_deleted_cards = filtered_deleted_cards.filter(should_be_filtered)
}
function onclick (){
    let answer = prompt('What title do you want?')
    let answer_2 = prompt('What note do you want?')
    // let titlearea = card.getElementsByTagName ('span') [0]
    // let textarea = card.getElementsByTagName ('p') [0]
    // titlearea.innerHTML = answer
    // textarea.innerHTML = answer_2
    // newnote(answer, answer_2)
    cards.push({title: answer, body: answer_2})
    load_cards()
}
function save_cards (){
    let cardsJSON = JSON.stringify(cards);
    localStorage.setItem('cards', cardsJSON)
    let trashcardsJSON = JSON.stringify(deleted_cards)
    localStorage.setItem('deleted_cards', trashcardsJSON)
}
function load_cards_from_storage (){
    let cardsJSON = localStorage.getItem('cards')
    if (cardsJSON !== null ){
        cards = JSON.parse(cardsJSON);
    }
    let trashcardsJSON = localStorage.getItem('deleted_cards')
    if (trashcardsJSON !== null ){
        deleted_cards = JSON.parse(trashcardsJSON)
    }
}
function switch_page (Is_Notes_Page){
    is_notes_page = Is_Notes_Page
    load_cards()
    let Notes_Page = document.getElementById ('Notes_Page')
    let Trash_Page = document.getElementById ('Trash_Page')
    Notes_Page.classList.remove('Selected_page')
    Trash_Page.classList.remove('Selected_page')
    if (is_notes_page) {
        Notes_Page.classList.add('Selected_page')
        page_indicator.innerHTML = ('Notes')
    } else {
        Trash_Page.classList.add('Selected_page')
        page_indicator.innerHTML = ('Trash')
    }
}
function delete_card (number) {
    if (is_notes_page) {
        deleted_cards.push (cards[number])
        cards.splice(number, 1)
        load_cards()    
    }
    else{
        deleted_cards.splice(number, 1)
        load_cards()
    }
}
function retrieve (number) {
    if (!is_notes_page){
        cards.push (deleted_cards[number])
        deleted_cards.splice(number, 1 )
        load_cards()
    }
}
function edit_card (number){
    if (is_notes_page){
        let title = cards [number].title
        let body = cards [number].body
        let new_title = prompt ('What do you want your new title of your note to be?', title)
        let new_body = prompt ('What do you want to change your note to?', body)
        cards[number] = {title: new_title, body: new_body}
        load_cards()
    }
}
function newnote (title, body, index){
    let newcard = `<div class="letter_card">
    <div class="icon_container">
    <img src="arrow-back.svg" class="back_arrow" onclick="retrieve (${index})" alt="rescue">
    <img src="edit.svg" onclick="edit_card (${index})" class="edit_card"alt="edit_card">
    <img src="trash.svg" onclick="delete_card (${index})" class="trash_card"alt="trash_card">
    </div>
    <span>${title}</span>
    <p>${body}</p>
    </div>`
    section.innerHTML += newcard
}
function load_cards(){
    search()
    section.innerHTML = ''
    if (is_notes_page) {
        for (let index = 0; index < filtered_cards.length; index++) {
            let title = filtered_cards[index].title
            let body = filtered_cards[index].body
            let item_index = filtered_cards [index].index
            newnote(title, body, item_index)    
        }   
    } else {
        for (let index = 0; index < filtered_deleted_cards.length; index++) {
            let title = filtered_deleted_cards[index].title
            let body = filtered_deleted_cards[index].body
            let item_index = filtered_deleted_cards [index].index
            newnote(title, body, item_index)        
        }
    }
    save_cards()
}
load_cards_from_storage()
load_cards()