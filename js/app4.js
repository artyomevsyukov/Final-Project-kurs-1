"use strict";

// variables
let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

// localStorage
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

// utilitars
function loadData() {
    const habbitString = localStorage.getItem(HABBIT_KEY);
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
function validateAndGetFormData(form, fields) {
    const formData = new FormData(form);
    const res = {};
    for (const field of fields) {
        const fieldValue = formData.get(field);
        form[field].classList.remove("error");
        if (!fieldValue) {
            form[field].classList.add("error");
        }
        res[field] = fieldValue;
    }
    let isValid = true;
    for (const field of fields) {
        if (!res[field]) {
            isValid = false;
        }
    }
    if (!isValid) {
        return;
    }
    console.log("res:", res);
    return res;
}
function resetForm(form, fields) {
    for (const field of fields) {
        form[field].value = "";
    }
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
    page.header.progressPercent.textContent = progress.toFixed(0) + "%";
    page.header.progressCoverBar.setAttribute("style", `width:${progress}%`);
}
function rerenderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = "";
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
    }
    page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

// работа с днями
function addDays(event) {
    event.preventDefault();
    const data = validateAndGetFormData(event.target, ["comment"]);
    if (!data) {
        return;
    }

    habbits = habbits.map((habbit) => {
        if (globalActiveHabbitId === habbit.id) {
            return {
                ...habbit,
                days: habbit.days.concat({ comment: data.comment }),
            };
        }
        return habbit;
    });
    resetForm(event.target, ["comment"]);
    rerender(globalActiveHabbitId);
    saveData();
}

function deleteDays(index) {
    habbits = habbits.map((habbit) => {
        if (habbit.id === globalActiveHabbitId) {
            habbit.days.splice(index, 1);
            return habbit;
        }
        return habbit;
    });
    saveData();
    rerender(globalActiveHabbitId);
}
// Работа с Popup

function setIcon(context, icon) {
    page.popup.iconField.value = icon;
    const activeIcon = document.querySelector(
        ".popup__icon.popup__icon_active"
    );
    activeIcon.classList.remove("popup__icon_active");
    context.classList.add("popup__icon_active");
}

function addHabbit(event) {
    event.preventDefault();
    const data = new validateAndGetFormData(event.target, [
        "icon",
        "name",
        "target",
    ]);
    if (!data) {
        return;
    }

    const nextId = habbits.length + 1;
    habbits.push({
        id: nextId,
        name: data.name,
        icon: data.icon,
        target: data.target,
        days: [],
    });
    resetForm(event.target, ["name", "target"]);
    saveData();
    toglePopup();
    rerender(nextId);
}

function rerender(activeHabbitID) {
    globalActiveHabbitId = activeHabbitID;
    let activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitID);

    if (!activeHabbit) {
        return;
    }
    document.location.replace(
        document.location.pathname + "#" + activeHabbitID
    );

    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit);
}
// init
(() => {
    loadData();
    const hashId = Number(document.location.hash.replace("#", ""));
    const urlHabbit = habbits.find((habbit) => habbit.id === hashId);

    if (urlHabbit) {
        rerender(urlHabbit.id);
    } else {
        rerender(habbits[0].id);
    }
})();
