"use strict";
// variables
let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

// data
const data = [
    {
        id: 1,
        icon: "sport",
        name: "Отжимания",
        target: 10,
        days: [
            { comment: "Первый подход всегда даётся тяжело" },
            { comment: "Второй день уже проще" },
        ],
    },
    {
        id: 2,
        icon: "food",
        name: "Правильное питание",
        target: 10,
        days: [{ comment: "Круто!" }],
    },
];
const dataString = JSON.stringify(data);
localStorage.setItem("HABBIT_KEY", dataString);

//page
const page = {
    menu: document.querySelector(".menu__list"),
};
//utils

function loadDate() {
    const habbitString = localStorage.getItem(HABBIT_KEY);
    // console.log(habbitString);
    const habbitArray = JSON.parse(habbitString);
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

//render

function rerenderMenu(activeHabbit) {
    // Проверяем есть ли меню относящееся к этой привычке
    if (!activeHabbit) {
        return;
    }

    for (const habbit of habbits) {
        const existed = document.querySelector(
            `[menu-habbit-id="${habbit.id}"]`
        );
        if (!existed) {
            const element = document.createElement("button");
            element.setAttribute("menu-habbit-id", habbit.id);
            element.classList.add("menu__item", "btn");
            element.addEventListener("click", () => rerender(habbit.id));
            element.innerHTML = `<img src="./img/svg/${habbit.icon}.svg" alt="${habbit.name}" />`;

            if (activeHabbit.id === habbit.id) {
                element.classList.add("menu__item_active");
            }

            page.menu.appendChild(element);
            continue; // если не существовал создать и перейти к следующей итерации и не идти ниже
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

//init
(() => {
    loadDate();
    // console.log(habbits);
    rerender(habbits[0].id); //0 активный по умолчанию
})();
