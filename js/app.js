"use strict";
// todo
// кнопка изменение комментария + изменение комментария

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
        iconField: document.querySelector(".popup__form input[name='icon']"),
    },
};

//utilitars

function loadData() {
    try {
        const habbitString = localStorage.getItem(HABBIT_KEY);
        const habbitArray = JSON.parse(habbitString);
        if (Array.isArray(habbitArray)) {
            habbits = habbitArray;
        }
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        habbits = [];
    }
}

function saveData() {
    try {
        localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
    } catch (error) {
        console.error("Ошибка при сохранении данных:", error);
        // Обработка ошибки, например, можно показать сообщение пользователю
    }
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
        // else {
        //     form[field].classList.remove("error");
        //     form[field].value = "";
        // }
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
    // console.log("res", res);
    return res;
}
function resetForm(form, fields) {
    for (const field of fields) {
        form[field].value = "";
    }
}
//render

function rerenderMenu(activeHabbit) {
    page.menu.innerHTML = "";
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

    document.location.replace(
        document.location.pathname + "#" + activeHabbitID
    );
    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderContent(activeHabbit);
}

// Работа с днями

function addDays(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const comment = data.get("comment");

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
function setIcon(context, icon) {
    page.popup.iconField.value = icon;
    console.log(page.popup.iconField.value);
    let activeIcon = document.querySelector(".popup__icon.popup__icon_active");
    activeIcon.classList.remove("popup__icon_active");
    context.classList.add("popup__icon_active");
}
function addHabbit(event) {
    event.preventDefault();

    const formData = validateAndGetFormData(event.target, [
        "icon",
        "name",
        "target",
    ]);
    console.log("formData", formData);

    const nextId = habbits.length + 1;
    habbits.push({
        id: nextId,
        icon: formData.icon,
        name: formData.name,
        target: formData.target,
        days: [],
    });
    resetForm(event.target, ["name", "target"]);
    saveData();
    toglePopup();
    rerender(nextId);
}

function deleteHabbit() {
    // Находим индекс удаляемой привычки
    const habbitIndex = habbits.findIndex(
        (habbit) => habbit.id === globalActiveHabbitId
    );
    // Удаляем привычку
    habbits = habbits.filter((habbit) => habbit.id !== globalActiveHabbitId);

    // Если после удаления список привычек не пустой
    if (habbits.length > 0) {
        // Если удаляемая привычка не была последней, активной станет привычка,
        // которая находилась после удаленной
        const nextActiveHabbitId =
            habbits[Math.min(habbitIndex, habbits.length - 1)].id;
        rerender(nextActiveHabbitId);
    } else {
        // Если список привычек пустой, то очищаем интерфейс
        page.menu.innerHTML = "";
        page.header.title.textContent = "";
        page.header.progressPercent.textContent = "";
        page.header.progressCoverBar.setAttribute("style", "width:0%");
        page.content.daysContainer.innerHTML = "";
        // И обнуляем globalActiveHabbitId
        globalActiveHabbitId = null;
    }
}
// init
(() => {
    loadData();
    const hashID = Number(document.location.hash.replace("#", ""));
    const urlHabbitId = habbits.find((habbit) => habbit.id === hashID);

    if (urlHabbitId) {
        rerender(urlHabbitId.id);
    } else {
        rerender(habbits[0].id);
    }
})();
