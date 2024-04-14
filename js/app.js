"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

//page

const page = {
    menu: document.querySelector(".menu__list"),
};

//utils

function loadDate() {
    let habbitsString = localStorage.getItem(HABBIT_KEY);
    let habbitArray = JSON.parse(habbitsString);
    // Добавить проверку try catch на невалидный JSON
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

//render

function rerenderMenu(activeHabbit) {
    if (!activeHabbit) {
        return;
    }
    // habbits.forEach(habbit => {

    // })
    for (const habbit of habbits) {
        // Проверяем есть ли меню относящееся к этой привычке
        console.log(habbit);
        const existed = document.querySelector(
            `[menu-habbit-id="${habbit.id}"]`
        );
        console.log(existed);
        if (!existed) {
            //create
        } else {
        }
        if (activeHabbit.id === habbit.id) {
        }
    }
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
}

(() => {
    loadDate();
    console.log(habbits);
    // rerenderMenu()
})();
