// Toggle menu function
/*
    Parameters:
    action: The action parameter can either be "open" or "close"
    container: The container parameter is a querySelector to the element where the classes are to be added/removed from
*/
const toggleMenu = function(action, container) {
    if (action === "open") {
        container.classList.add("no-scroll", "menu-open");
    } else if (action === "close") {
        container.classList.remove("no-scroll", "menu-open");
    }
};

// Form focus function
/*
    Parameters:
    form: The form parameter is a querySelector to the forms form element
*/
const formFocus = function(form) {
    const initialize = function() {
        setFocusEventListener("focusin");
        setFocusEventListener("focusout");
    };

    const setFocusEventListener = function(action) {
        form.addEventListener(action, function(event){
            const input = event.target;
            setFocusClass(input, action);
        });
    };

    const setFocusClass = function(input, action) {
        const parentElement = input.parentElement;
        if (action === "focusin") {
            if (input.getAttribute("type") === "checkbox" || input.getAttribute("type") === "radio") {
                input.classList.add("focused");
            } else {
                parentElement.classList.add("focused");
            }
        } else if (action === "focusout") {
            if (input.getAttribute("type") === "checkbox" || input.getAttribute("type") === "radio") {
                input.classList.remove("focused");
            } else {
                parentElement.classList.remove("focused");
            }
        }
    };


    return { initialize };
};

// Form validation function
/*
    Parameters:
    form: The form parameter is a querySelector to the forms form element
*/
const formValidation = function(form) {
    const initialize = function() {
        validateOnSubmit();
        validateOnInput();
    };

    const validateOnSubmit = function() {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            const formSubmitContainer = form.querySelector(".form_submit");

            if (validateFormGroups() === true) {
                const successMessageDiv = document.createElement("div");
                successMessageDiv.classList.add("submit_success-message");
                successMessageDiv.innerHTML = "Thank you for contacting Zephyr. We have received your email and will get back to you as soon as possible";
                formSubmitContainer.append(successMessageDiv);
            }
        });
    };

    const validateOnInput = function() {
        const inputs = form.querySelectorAll(".input");

        inputs.forEach(function(input) {
            input.addEventListener("input", function() {
                let formGroup;
                if (input.getAttribute("type") === "checkbox" || input.getAttribute("type") === "radio") {
                    formGroup = input.parentElement.parentElement.parentElement;
                } else {
                    formGroup = input.parentElement;
                }

                validateFormGroupInputs(formGroup);
            });
        });
    };

    const validateFormGroups = function() {
        const formGroups = form.querySelectorAll(".form_group");
        let validations = [];

        formGroups.forEach(function(formGroup, index) {
            validations[index] = validateFormGroupInputs(formGroup);
        });

        console.log(validations.every(Boolean));
        return validations.every(Boolean) === true ? true : false;
    };

    const validateFormGroupInputs = function(formGroup) {
        const input = formGroup.querySelector(".input");
        const inputType = formGroup.querySelector(".input").getAttribute("type");

        let isValid = false;

        switch(inputType) {
            case "text":
                isValid = validateTextInputType(input);
                break;
            case "email":
                isValid = validateEmailInputType(input);
                break;
            case "checkbox":
                isValid = validateCheckboxInputType(formGroup);
                break;
            case "radio":
                isValid = validateRadioInputType(formGroup);
                break;
        };

        return isValid === true ? true : false;
    };

    const validateTextInputType = function(input) {
        if (sanitizeValue(input) === "") {
            if (input.getAttribute("name") === "name") {
                setMessage(input, "Please input your name.", "add");
            } else if(input.getAttribute("name") === "description") {
                setMessage(input, "Please include some details about your project.", "add");
            }
            return false;
        } else {
            setMessage(input, null, "remove");
            return true;
        }
    };

    const validateEmailInputType = function(input) {
        const re = /[a-zA-Z0-9.+_-]+@[a-zA-Z]+.[a-zA-Z]+.[a-zA-Z]+/;
        if (re.test(input.value) === true) {
            setMessage(input, null, "remove");
            return true;
        } else {
            setMessage(input, "Please input your email address.", "add");
            return false;
        }
    };

    const validateCheckboxInputType = function(formGroup) {
        const inputs = formGroup.querySelectorAll(".input");
        const input = formGroup.querySelector(".input");
        let validations = [];

        inputs.forEach(function(input, index) {
            input.checked ? validations[index] = true : validations[index] = false;
        });

        const validCount = validations.filter(Boolean).length;

        if (validCount >= 1) {
            setMessage(input, null, "remove");
            return true;
        } else {
            setMessage(input, "Please select your required service/s.", "add");
            return false;
        }
        console.log(validations);
    };

    const validateRadioInputType = function(formGroup) {
        const inputs = formGroup.querySelectorAll(".input");
        const input = formGroup.querySelector(".input");
        let validations = [];

        inputs.forEach(function(input, index) {
            input.checked ? validations[index] = true : validations[index] = false;
        });

        const validCount = validations.filter(Boolean).length;

        if (validCount >= 1) {
            setMessage(input, null, "remove");
            return true;
        } else {
            setMessage(input, "Please select your budget.", "add");
            return false;
        }
    };

    const sanitizeValue = function(input) {
        return input.value.trim();
    };

    const setMessage = function(input, message, action) {
        const inputType = input.getAttribute("type");
        let parentContainer;

        if (inputType === "checkbox" || inputType === "radio") {
            parentContainer = input.parentElement.parentElement.parentElement;
        } else {
            parentContainer = input.parentElement;
        }

        const errorContainer = parentContainer.querySelector(".group_error");

        if (action === "add") {
            if (errorContainer) {
                errorContainer.remove();
            }

            const errorContainerDiv = document.createElement("div");
            errorContainerDiv.classList.add("group_error");
            errorContainerDiv.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M8 1.5c-1.736 0-3.369 0.676-4.596 1.904s-1.904 2.86-1.904 4.596c0 1.736 0.676 3.369 1.904 4.596s2.86 1.904 4.596 1.904c1.736 0 3.369-0.676 4.596-1.904s1.904-2.86 1.904-4.596c0-1.736-0.676-3.369-1.904-4.596s-2.86-1.904-4.596-1.904zM8 0v0c4.418 0 8 3.582 8 8s-3.582 8-8 8c-4.418 0-8-3.582-8-8s3.582-8 8-8zM7 11h2v2h-2zM7 3h2v6h-2z"></path></svg>
            <span class="error_message">${message}</span>`;
            parentContainer.append(errorContainerDiv);
        } else if (action === "remove") {
            if (errorContainer) {
                errorContainer.remove();
            }
        }
    };


    return { initialize };
};

// Header
const header = (function() {
    const body = document.querySelector("body");
    const menuButton = document.querySelector("#menuToggle");

    menuButton.addEventListener("click", function() {
        !body.classList.contains("menu-open") ? toggleMenu("open", body) : toggleMenu("close", body);
    });
})();

// Contact form
const contactForm = (function() {
    const form = document.querySelector(".contact_form form");

    if (!form) {
        return;
    }

    const addFocusToForm = formFocus(form);
    addFocusToForm.initialize();

    const addValidationToForm = formValidation(form);
    addValidationToForm.initialize();
})();