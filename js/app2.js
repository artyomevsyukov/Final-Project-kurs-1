"use strict";
// variables
let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

// data
// const data = [
//     {
//         id: 1,
//         icon: "sport",
//         name: "Отжимания",
//         target: 3,
//         days: [
//             { comment: "Первый подход всегда даётся тяжело" },
//             { comment: "Второй день уже проще" },
//         ],
//     },
//     {
//         id: 2,
//         icon: "food",
//         name: "Правильное питание",
//         target: 10,
//         days: [{ comment: "Круто!" }],
//     },
// ];
// const dataString = JSON.stringify(data);
// localStorage.setItem("HABBIT_KEY", dataString);

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
    },
};

//utilitars

function loadDate() {
    const habbitsString = localStorage.getItem(HABBIT_KEY);
    const habbitsArray = JSON.parse(habbitsString);
    if (habbitsArray) {
        habbits = habbitsArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function toglePopup() {
    console.log(page.popup.cover);
    page.popup.cover.classList.toggle("cover_hiden");
}
// function validateAndGetFormData
// function resetForm
//render

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
    // page.header.progressCoverBar.style = `width:${progress}%`;
    page.header.progressCoverBar.setAttribute("style", `width:${progress}%`);
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
        <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
        <button class="habbit__delete" name="delete" aria-label="delete" type="button" onclick="deleteDays(${index})">
            <svg class="icon">
                <use xlink:href="img/sprite.svg#delete"></use>
            </svg>
        </button>
        `;
        page.content.daysContainer.appendChild(element);
    }
    page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;
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

// Работа с днями

function addDays(event) {
    event.preventDefault();
    const form = event.target;
    // console.log(form);
    const data = new FormData(form);
    const comment = data.get("comment");
    // console.log(comment);
    // console.log(form["comment"]);

    if (!comment) {
        form["comment"].classList.add("error");
    } else {
        form["comment"].classList.remove("error");
        form["comment"].value = "";

        habbits.map((habbit) => {
            if (globalActiveHabbitId == habbit.id) {
                return habbit.days.push({ comment });
            }
            return habbit;
        });
        rerender(globalActiveHabbitId);
        saveData();
    }
}

function deleteDays(index) {
    habbits = habbits.map((habbit) => {
        if (globalActiveHabbitId === habbit.id) {
            habbit.days.splice(index, 1);
            return habbit;
        }
        return habbit;
    });
    saveData();
    rerender(globalActiveHabbitId);
}
// function setIcon
// function addHabbit
// init
(() => {
    loadDate();
    // saveData();
    rerender(habbits[0].id);
})();
