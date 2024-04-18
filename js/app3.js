"use strict";

// variables
let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

// date

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
// render

// function rerenderMenu(activeHabbit) {
//     for (const habbit of habbits) {
//         const existed = document.querySelector(
//             `[menu-habbit-id="${habbit.id}"]`
//         );
//         console.log(habbit);
//         console.log(habbit.id);
//         if (!existed) {
//             const element = document.createElement("button");
//             element.setAttribute("menu-habbit-id", habbit.id);
//             element.classList.add("menu__item", "btn");
//             element.addEventListener("click", () => rerender(habbit.id));
//             element.innerHTML = `<img src="./img/svg/${habbit.icon}.svg" alt="${habbit.icon}">`;

//             if (activeHabbit.id === habbit.id) {
//                 element.classList.add("menu__item_active");
//             }
//             page.menu.appendChild(element);
//             continue;
//         }

//         if (activeHabbit.id === habbit.id) {
//             existed.classList.add("menu__item_active");
//         } else {
//             existed.classList.remove("menu__item_active");
//         }
//     }
// }

// function rerenderMenu(activeHabbit) {
//     for (const habbit of habbits) {
//         const existed = document.querySelector(
//             `[menu-habbit-id="${habbit.id}"]`
//         );
//         if (!existed) {
//             const element = document.createElement("button");
//             element.classList.add("menu__item", "btn");
//             element.setAttribute("menu-habbit-id", habbit.id);
//             element.innerHTML = `<img src="./img/svg/${habbit.icon}.svg" alt="${habbit.icon}">`;
//             page.menu.appendChild(element);
//             element.addEventListener("click", () => rerender(habbit.id));

//             if (activeHabbit.id === habbit.id) {
//                 element.classList.add("menu__item_active");
//             }
//             continue;
//         }

//         if (activeHabbit.id === habbit.id) {
//             existed.classList.add("menu__item_active");
//         } else {
//             existed.classList.remove("menu__item_active");
//         }
//     }
// }

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
                        <div class="habbit__comment">${
                            activeHabbit.days[index].comment
                        }</div>
                        <button class="habbit__delete" name="delete" aria-label="delete" type="button">
                            <svg class="icon">
                                <use xlink:href="img/sprite.svg#delete"></use>
                            </svg>
                        </button>
        `;
        page.content.daysContainer.appendChild(element);
    }
    page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
    // page.content.nextDay.setAttribute("form-comment-id", index);
}
// preventDefault;
// FormData;
// ("comment");
// error;
function addDays(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const comment = data.get("comment");
    // form["comment"].classList.remove("error");
    if (!comment) {
        form["comment"].classList.add("error");
    } else {
        form["comment"].classList.remove("error");
        form["comment"].value = "";
    }
    console.log(comment);

    // habbits = habbits.map((habbit) => {
    //     let el = comment.value;
    //     habbit.days.push({});
    // });
}

function rerender(activeHabbitID) {
    let activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitID);
    // console.log(activeHabbit);
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
