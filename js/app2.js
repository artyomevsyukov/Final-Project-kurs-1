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
    form: {
        // input: document.querySelector(".habbit-form__input"),
    },
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

function rerenderHead(activeHabbit) {
    page.header.title.innerText = `${activeHabbit.name}`;
    const progress =
        activeHabbit.days.length / activeHabbit.target > 1
            ? 100
            : (activeHabbit.days.length / activeHabbit.target) * 100;
    page.header.progressPercent.innerText = progress.toFixed(0) + "%";
    page.header.progressCoverBar.style = `width: ${progress}%`;
    // page.header.progressCoverBar.setAttribute("style", `width: ${progress}%`);
}

function rerenderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = "";
    for (const index in activeHabbit.days) {
        const element = document.createElement("div");
        // element.setAttribute("habbit-id", index + 1);
        element.classList.add("habbit");
        element.innerHTML = `<div class="habbit__day">
            <div class="habbit__flex-text">День ${Number(index) + 1}</div>
            </div>
            <div class="habbit__comment">${
                activeHabbit.days[index].comment
            }</div>
            <button class="habbit__delete" name="delete" aria-label="delete" type="button" onclick="deleteDays(${index})">
            <svg class="icon">
                <use xlink:href="img/sprite.svg#delete"></use>
            </svg>
            </button>`;
        page.content.daysContainer.appendChild(element);
    }
    page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
    globalActiveHabbitId = activeHabbitId;
    const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
    if (!activeHabbit) {
        return;
    }
    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit);
}

// preventDefault;
// FormData;
// ("comment");
// error;

function addDays(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const form = event.target;
    const comment = data.get("comment");
    // console.log(event.target);
    // console.log(data);
    // console.log(form);
    // console.log(comment);
    // console.log(globalActiveHabbitId);
    form["comment"].classList.remove("error");
    if (!comment) {
        form["comment"].classList.add("error");
    } else {
        console.log({ ...habbits });
        habbits = habbits.map((habbit) => {
            if (habbit.id === globalActiveHabbitId) {
                // return {
                //     ...habbit,
                //     // days: habbit.days.push({ comment }),
                //     days: habbit.days.concat({ comment }),
                // };
                habbit.days.push({ comment });
                return {
                    ...habbit,
                };
            }
            // console.log(habbits);
            return habbit;
        });

        form["comment"].value = "";
        rerender(globalActiveHabbitId);
        console.log("add ", habbits);
        saveData();
    }
}

function deleteDays(index) {
    habbits = habbits.map((habbit) => {
        if (habbit.id === globalActiveHabbitId) {
            habbit.days.splice(index, 1);
            return {
                ...habbit,
                days: habbit.days,
            };
        }
        return habbit;
    });
    rerender(globalActiveHabbitId);
    console.log("del ", habbits);
    saveData();
}

// function deleteDays(index) {
//     habbits = habbits.map((habbit) => {
//         if (habbit.id === globalActiveHabbitId) {
//             habbit.days.splice(index, 1);
//             return {
//                 ...habbit,
//                 days: habbit.days,
//             };
//         }
//         return habbit;
//     });
//     rerender(globalActiveHabbitId);
//     console.log("del ", habbits);
//     console.log("del ", habbits);
//     saveData();
// }

//init

// init
(() => {
    loadDate();
    // console.log(habbits);
    rerender(habbits[0].id); //0 активный по умолчанию
})();
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// {/* <button class="habbit__delete" name="delete" aria-label="delete" type="button" onclick="deleteDays(${index})"></button> */}
