"use strict";

// variables
let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

// date
// [
//     {
//         "id": 1,
//         "icon": "sport",
//         "name": "Отжимания",
//         "target": 10,
//         "days": [
//             { "comment": "Первый подход всегда даётся тяжело" },
//             { "comment": "Второй день уже проще" }
//         ]
//     },
//     {
//         "id": 2,
//         "icon": "food",
//         "name": "Правильное питание",
//         "target": 10,
//         "days": [{ "comment": "Круто!" }]
//     }
// ]
// page

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
    popup: {
        cover: document.getElementById("add-habbit-popup"),
        iconField: document.querySelector('.popup__form input[name="icon"]'),
    },
};

// utils
function loadDate() {
    const habbitString = localStorage.getItem("HABBIT_KEY");
    const habbitArray = JSON.parse(habbitString);
    if (Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}
function toglePopup() {
    page.popup.cover.classList.toggle("cover_hiden");
}

// render

function rerenderMenu(activeHabbit) {
    for (const habbit of habbits) {
        const existed = document.querySelector(
            `[menu-habbit-id="${habbit.id}"]`
        );

        if (!existed) {
            const element = document.createElement("button");
            element.classList.add("menu__item", "btn");
            element.setAttribute("menu-habbit-id", habbit.id);
            element.innerHTML = `<img src="./img/svg/${habbit.icon}.svg" alt="habbit.icon">`;
            page.menu.appendChild(element);
            element.addEventListener("click", () => rerender(habbit.id));
            if (activeHabbit.id === habbit.id) {
                element.classList.add("menu__item_active");
            }
            continue;
        }

        if (activeHabbit.id === habbit.id) {
            existed.classList.add("menu__item_active");
        } else {
            existed.classList.remove("menu__item_active");
        }
    }
}
function rerenderHead(activeHabbit) {
    page.header.title.textContent = activeHabbit.name;
    const progress =
        activeHabbit.days.length / activeHabbit.target > 1
            ? 100
            : (activeHabbit.days.length / activeHabbit.target) * 100;
    page.header.progressPercent.textContent = progress + "%";
    page.header.progressCoverBar.setAttribute("style", `width:${progress}%`);
    // page.header.progressCoverBar.style = `width:${progress}%`;
}
function rerenderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = "";
    // for (const index in habbits.days) {
    for (const index in activeHabbit.days) {
        const element = document.createElement("div");
        element.classList.add("habbit");
        element.innerHTML = `
                    <div class="habbit__day">
                            <div class="habbit__flex-text">День ${
                                Number(index) + 1
                            }</div>
                        </div>
                        <div class="habbit__comment">
                        ${activeHabbit.days[index].comment}
                        </div>
                        <button class="habbit__delete" name="delete" aria-label="delete" type="button" onclick="deleteDays(${index})">
                            <svg class="icon">
                                <use xlink:href="img/sprite.svg#delete"></use>
                            </svg>
                        </button>
        `;
        page.content.daysContainer.appendChild(element);
        // element.setAttribute("deleteBtn-id", index);
    }
    page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

// работа с днями
function addDays(event) {
    const form = event.target;
    event.preventDefault();
    const data = new FormData(form);
    const comment = data.get("comment");
    // form["comment"].classList.remove("error");
    if (!comment) {
        form["comment"].classList.add("error");
    } else {
        form["comment"].classList.remove("error");
        form["comment"].value = "";
        habbits = habbits.map((habbit) => {
            if (globalActiveHabbitId === habbit.id) {
                habbit.days.push({ comment });
                return habbit;
                return {
                    ...habbit,
                    // days: habbit.days.concat({ comment }),
                };
            }
            return habbit;
        });
        rerender(globalActiveHabbitId);
        saveData();
    }
}
function deleteDays(index) {
    habbits = habbits.map((habbit) => {
        console.log("!!!habbit:", habbit);
        console.log("{habbit}", { habbit });
        console.log("{...habbit}", { ...habbit });
        if (habbit.id === globalActiveHabbitId) {
            habbit.days.splice(index, 1);
            return habbit;
            return {
                ...habbit,
                // days: habbit.days
                // days: habbit.days.splice(index, 1),
            };
        }
        return habbit;
    });
    saveData();
    rerender(globalActiveHabbitId);
}
// Работа с Popup
// document.querySelector(".popup__title").addEventListener("click", function () {
//     console.log(this);
// });

function setIcon(context, icon) {
    page.popup.iconField.value = icon;
    console.log(page.popup.iconField.value);
    const activeIcon = document.querySelector(
        ".popup__icon.popup__icon_active"
    );
    activeIcon.classList.remove("popup__icon_active");
    context.classList.add("popup__icon_active");
}

function rerender(activeHabbitID) {
    globalActiveHabbitId = activeHabbitID;
    let activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitID);

    if (!activeHabbit) {
        return;
    }
    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit);
}
// init
(() => {
    loadDate();

    rerender(habbits[0].id);
})();
