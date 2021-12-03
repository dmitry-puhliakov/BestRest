"use strict";

//-----------------------------find elements
const registrationForm = document.querySelector(".registration__form");
const firstNameInput = document.getElementById("first-name");
const secondNameInput = document.getElementById("second-name");
const countryInput = document.getElementById("country");
const countriesList = document.querySelector(".countries__list");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const emailInput = document.getElementById("email");
const agreeCheckbox = document.getElementById("agree");

//-----------------------------init ScrollOut
const fieldsTransition = new ScrollOut({
  once: true,
});

//-----------------------------load countries data and events handling
const countriesURL = "data/country-id.json";

window.onload = function () {
  fetch(countriesURL)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject([
          {
            name: "Russia",
            dial_code: "+7",
            code: "RU",
          },
          {
            name: "Ukraine",
            dial_code: "+380",
            code: "UA",
          },
          {
            name: "United States",
            dial_code: "+1",
            code: "US",
          },
        ]);
      }

      return response.json();
    })
    .then((data) => {
      countryToPhone(data);
    })

    .catch((err) => {
      countryToPhone(err);
      console.warn("Load countries data error. Used simle data");
    });
};

function countryToPhone(data) {
  countriesList.innerHTML = data
    .map(({ name }) => {
      return `<li class="countries__item">${name}</li>`;
    })
    .join("");

  countryInput.addEventListener("keyup", filterCountriesList);

  countriesList.addEventListener("click", (event) => {
    console.log("foo");
    countryInput.value = event.target.textContent;
  });

  phoneInput.addEventListener("focus", (event) => {
    let mask = "+";

    if (countryInput.value) {
      const dataItem = data.find(({ name }) => name == countryInput.value);

      if (dataItem) {
        mask = dataItem.dial_code;
      }
    }

    event.target.value = mask;
  });

  function filterCountriesList(event) {
    const fieldValue = event.target.value;

    countriesList.innerHTML = data
      .filter(({ name }) => {
        return name.toLowerCase().includes(fieldValue.toLowerCase());
      })
      .map(({ name }) => {
        return `<li class="countries__item">${name}</li>`;
      })
      .join("");
  }
}

//-----------------------------other events handling
countryInput.addEventListener("focus", () => {
  const parrentField = countryInput.closest(".field");

  countriesList.style.cssText = `
    display: block;
    top: ${parrentField.offsetTop + countryInput.offsetHeight + 2}px;
    left: ${parrentField.offsetLeft}px;
    width: ${parrentField.offsetWidth + 1}px;
  `;
});

countryInput.addEventListener("blur", () => {
  window.setTimeout(() => (countriesList.style.cssText = ""), 500);
});

//-----------------------------submit/validation form
registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let isAllValid = true;

  if (firstNameInput.value.length <= 2) {
    isAllValid = false;
    setErrorStyle(firstNameInput);
  }

  if (secondNameInput.value.length <= 2) {
    isAllValid = false;
    setErrorStyle(secondNameInput);
  }

  if (countryInput.value.length <= 0) {
    isAllValid = false;
    setErrorStyle(countryInput);
  }

  if (phoneInput.value.length <= 1) {
    isAllValid = false;
    setErrorStyle(phoneInput);
  }

  if (
    !/(?=.*[0-9])(?=.*[!@#$%^&*\-_])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*\-_]{6,}/g.test(
      passwordInput.value
    )
  ) {
    isAllValid = false;
    setErrorStyle(passwordInput);
  }

  if (passwordInput.value !== confirmPasswordInput.value ||
    confirmPasswordInput.value == '') {
    isAllValid = false;
    setErrorStyle(confirmPasswordInput);
  }

  if (!/^[^\s@]+@[^\s@]+$/.test(emailInput.value)) {
    isAllValid = false;
    setErrorStyle(emailInput);
  }
console.log(agreeCheckbox.checked);
  if (!agreeCheckbox.checked) {

    isAllValid = false;
    setErrorStyle(agreeCheckbox);
  }

  function setErrorStyle(element) {
    element.closest(".field").classList.add("field--err");
    window.setTimeout(
      () => element.closest(".field").classList.remove("field--err"),
      4000
    );
  }

  if (isAllValid) {
    alert('Данные отправлены');
  }
});

//-----------------------------smooth scrolling
$(".greeting__btn .btn").on("click", function(e){
  e.preventDefault();
  var anchor = $(this).attr('href');
  $('html, body').stop().animate({
      scrollTop: $(anchor).offset().top
  }, 100);
});

//-----------------------------modal "Terms & Conditions"
const body = document.querySelector("body");
const openModalButtons = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');

openModalButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const modal = document.querySelector(button.dataset.modalTarget);

    openModal(modal);
  });
});

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active');

  modals.forEach(modal => {
    closeModal(modal);
  });
});

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');

    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;

  body.style.overflowY = "hidden";
  modal.classList.add('active');
  overlay.classList.add('active');
}

function closeModal(modal) {
  if (modal == null) return;

  body.removeAttribute("style");
  modal.classList.remove('active');
  overlay.classList.remove('active');
}
