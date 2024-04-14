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
        // console.log(habbit);

        const existed = document.querySelector(
            `[menu-habbit-id="${habbit.id}"]`
        );
        // console.log(existed);
        if (!existed) {
            // const element = document
            //     .createElement("button")
            //     .setAttribute("[menu-habbit-id", habbit.id)
            //     .classList.add("menu__item btn");
            //     element.innerHTML = `<svg class="icon">
            //     <use xlink:href="./img/sprite.svg#${habbit.icon}"></use>
            // </svg>`;
            const element = document.createElement("button");
            element.setAttribute("menu-habbit-id", habbit.id);
            element.classList.add("menu__item", "btn");
            element.addEventListener("click", () => rerender(habbit.id));
            element.innerHTML = `<img src="./img/svg/${habbit.icon}.svg" alt="${habbit.name}" />`;

            if (activeHabbit.id === habbit.id) {
                element.classList.add("menu__item_active");
            }
            page.menu.appendChild(element);

            continue;
        }

        if (activeHabbit.id === habbit.id) {
            existed.classList.add("menu__item_active");
        } else {
            existed.classList.remove("menu__item_active");
        }
    }
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
}

//
(() => {
    loadDate();
    // console.log(habbits);
    rerender(habbits[0].id);
})();
