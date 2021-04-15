/*
  main menu
*/
const menuButtonOpen = document.querySelector("#menu-button-open");
const menuButtonClose = document.querySelector("#menu-button-close");

menuButtonOpen.addEventListener("click", () =>
  document.body.classList.add("menu-is-open")
);
menuButtonClose.addEventListener("click", () =>
  document.body.classList.remove("menu-is-open")
);

/* 
  contact form
*/
const form = document.querySelector("#contact-form");
const inputWrappers = document.querySelectorAll(".form__input");
const submitButtonWrapper = document.querySelector("#submit-button-wrapper");
const submitting = document.querySelector(".form__submitting");
const submitSuccess = document.querySelector(".form__success");
const messageWrapper = document.querySelector("#message-wrapper");
const message = document.querySelector("#message");

// form subbmitting
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let error = false;

  // add error msg if input is empty
  inputWrappers.forEach((inputWrapper) => {
    const input = inputWrapper.querySelector("input[type='text']");

    if (!input.value) {
      inputWrapper.classList.add("form__has-error");
      error = true;
    } else {
      if (inputWrapper.classList.contains("form__has-error")) {
        inputWrapper.classList.remove("form__has-error");
      }
    }
  });

  // add error msg if textarea is empty
  const isMessageValid = message.value.trim().length > 10;

  if (!isMessageValid) {
    messageWrapper.classList.add("form__has-error");
    error = true;
  } else {
    if (messageWrapper.classList.contains("form__has-error")) {
      messageWrapper.classList.remove("form__has-error");
    }
  }

  if (error) {
    return;
  }

  // no error => POST request to server
  console.log("making POST requet to server");
  submitButtonWrapper.style.display = "none";
  submitting.style.opacity = "1";
  submitting.style.zIndex = "4";

  // setTimeout to simulate async call to server
  setTimeout(() => {
    console.log("POST request succesfull");
    submitting.style.opacity = "0";
    submitSuccess.style.opacity = "1";
    submitSuccess.style.zIndex = "5";

    // reset values after click
    submitSuccess.addEventListener("click", () => {
      submitting.style.zIndex = "2";
      submitSuccess.style.zIndex = "1";
      submitSuccess.style.display = "none";
      submitButtonWrapper.style.display = "block";
      message.value = "";
      inputWrappers.forEach((inputWrapper) => {
        const input = inputWrapper.querySelector("input[type='text']");
        input.value = "";
      });
    });
  }, 2000);
});

// form label change while typing
inputWrappers.forEach((inputWrapper) => {
  const input = inputWrapper.querySelector("input[type='text']");

  // focus event
  input.addEventListener("focus", (e) => {
    if (e.target.value) {
      return;
    }

    if (e.target.classList.contains("form__label-change")) {
      return;
    }

    inputWrapper.classList.add("form__label-change");
  });

  // blur event
  input.addEventListener("blur", (e) => {
    if (e.target.value) {
      return;
    }

    if (!inputWrapper.classList.contains("form__label-change")) {
      return;
    }

    inputWrapper.classList.remove("form__label-change");
  });
});

/* 
  observers
*/
const observerOptions = {
  threshold: 0,
  rootMargin: "0px 0px -300px 0px",
};

const contactObserverOptions = {
  threshold: 0,
};

const observer = (element, options) => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      element.classList.add("in-view");
      observer.unobserve(entry.target);
    });
  }, options);

  observer.observe(element);
};

const address = document.querySelector("#address");
const cardsValues = document.querySelectorAll(".card-values");
const needsValues = document.querySelectorAll(".card-needs");

cardsValues.forEach((card) => observer(card, observerOptions));
needsValues.forEach((card) => observer(card, observerOptions));
observer(address, contactObserverOptions);
observer(form, contactObserverOptions);

/*
  smooth scrolling
*/
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();

    if (document.body.classList.contains("menu-is-open")) {
      document.body.classList.remove("menu-is-open");
    }

    document.querySelector(anchor.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

/* 
  Google map
*/
function CustomZoomInControl(controlDiv, map) {
  const buttonUi = (text) => {
    const element = document.createElement("div");
    element.className = "map__button";
    element.innerHTML = text;
    return element;
  };

  const controlZoomIn = buttonUi("+");
  const controlZoomOut = buttonUi("-");
  controlDiv.appendChild(controlZoomIn);
  controlDiv.appendChild(controlZoomOut);

  google.maps.event.addDomListener(controlZoomIn, "click", function () {
    map.setZoom(map.getZoom() + 1);
  });

  google.maps.event.addDomListener(controlZoomOut, "click", function () {
    map.setZoom(map.getZoom() - 1);
  });
}

// Initialize and add the map
function initMap() {
  const address = { lat: 49.00108979616651, lng: 21.237291746910234 };
  // The map
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18,
    center: address,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
      },
    ],
  });

  const customZoomInControlDiv = document.createElement("div");
  customZoomInControlDiv.className = "map__zoom-control";
  const customZoomInControl = new CustomZoomInControl(
    customZoomInControlDiv,
    map
  );

  customZoomInControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(
    customZoomInControlDiv
  );

  // The marker
  const marker = new google.maps.Marker({
    position: address,
    label: {
      color: "#000",
      fontWeight: "bold",
      fontSize: "1rem",
      text: "Levočská 6116/5",
    },
    map: map,
    icon: {
      url: "../elements/images/marker.png",
      size: new google.maps.Size(25, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0),
      scaledSize: new google.maps.Size(25, 50),
      labelOrigin: new google.maps.Point(90, 50),
    },
  });
}
