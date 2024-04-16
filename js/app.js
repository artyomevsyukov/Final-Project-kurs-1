"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

// data
const data = [
    {
        id: 1,
        icon: "sport",
        name: "Отжимания",
        target: 3,
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
    {
        id: 3,
        icon: "water",
        name: "Правильное питание",
        target: 10,
        days: [
            { comment: "Круто!" },
            { comment: "Круто!" },
            { comment: "Круто!" },
        ],
    },
];
let dataString = JSON.stringify(data);
localStorage.setItem("HABBIT_KEY", dataString);

//page

const page = {
    menu: document.querySelector(".menu__list"),
    header: {
        title: document.querySelector(".header__title"),
        progressPercent: document.querySelector(".progress__percent"),
        progressCoverBar: document.querySelector(".progress__cover-bar"),
    },
    content: {
        daysContainer: document.getElementById("days"),
        nextDay: document.querySelector(".habbit__flex-text"),
        comment: document.querySelector(".habbit__comment"),
    },
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
        //если нет то создаем
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

            continue;
            // если не существовал создать и перейти к следующей итерации и не идти
        }

        if (activeHabbit.id === habbit.id) {
            existed.classList.add("menu__item_active");
        } else {
            existed.classList.remove("menu__item_active");
        }
    }
}
function rerenderHead(activeHabbit) {
    page.header.title.innerText = `${activeHabbit.name}`;
    const progress =
        activeHabbit.days.length / activeHabbit.target > 1
            ? 100
            : (activeHabbit.days.length / activeHabbit.target) * 100;
    page.header.progressPercent.textContent = progress.toFixed(0) + "%";
    page.header.progressCoverBar.style = `width:${progress.toFixed(0)}%`;
}
function rerenderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = "";
    for (const index in activeHabbit.days) {
        const element = document.createElement("div");
        element.classList.add("habbit");
        element.innerHTML = `
        <div class="habbit__day">
            <div class="habbit__flex-text">День ${Number(index) + 1}</div>
                </div>
                <div class="habbit__comment">${
                    activeHabbit.days[index].comment
                }</div>
                <button class="habbit__delete" name="delete" aria-label="delete" type="button">
                    <svg class="icon">
                        <use xlink:href="img/sprite.svg#delete"></use>
                    </svg>
                </button>`;

        page.content.daysContainer.appendChild(element);
        page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;
    }
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit);
}

function addDays(event) {
    event.preventDefault();
    console.log(event);
    const data = new FormData(event.target);
    console.log(data);
    console.log(data.get("comment"));
    console.log(data.getAll("comment"));
}

//init
(() => {
    loadDate();
    // console.log(habbits);
    rerender(habbits[0].id); //0 активный по умолчанию
})();
