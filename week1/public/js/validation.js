document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll("form");

    forms.forEach((form) => {

        form.addEventListener("submit", (event) => {

            const requiredFields =
                form.querySelectorAll("[required]");

            let isValid = true;


            requiredFields.forEach((field) => {

                field.setCustomValidity("");

                if (!field.value.trim()) {

                    field.setCustomValidity(
                        "This field is required."
                    );

                    isValid = false;

                    return;
                }


                if (
                    field.minLength > 0 &&
                    field.value.trim().length <
                        field.minLength
                ) {

                    field.setCustomValidity(
                        `Please enter at least ${field.minLength} characters.`
                    );

                    isValid = false;

                    return;
                }


                if (
                    field.maxLength > 0 &&
                    field.value.trim().length >
                        field.maxLength
                ) {

                    field.setCustomValidity(
                        `Please enter no more than ${field.maxLength} characters.`
                    );

                    isValid = false;
                }

            });


            const emailFields =
                form.querySelectorAll(
                    'input[type="email"]'
                );

            emailFields.forEach((field) => {

                field.setCustomValidity("");

                if (
                    field.value.trim() &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        field.value.trim()
                    )
                ) {

                    field.setCustomValidity(
                        "Please provide a valid email address."
                    );

                    isValid = false;
                }

            });


            const websiteFields =
                form.querySelectorAll(
                    'input[name="website"]'
                );

            websiteFields.forEach((field) => {

                field.setCustomValidity("");

                if (
                    field.value.trim() &&
                    !/^https?:\/\/.+/i.test(
                        field.value.trim()
                    )
                ) {

                    field.setCustomValidity(
                        "Website must begin with http:// or https://."
                    );

                    isValid = false;
                }

            });


            const numberFields =
                form.querySelectorAll(
                    'input[type="number"]'
                );

            numberFields.forEach((field) => {

                field.setCustomValidity("");

                if (
                    field.value &&
                    Number(field.value) < Number(field.min)
                ) {

                    field.setCustomValidity(
                        `Value must be at least ${field.min}.`
                    );

                    isValid = false;
                }

            });


            if (
                !form.checkValidity() ||
                !isValid
            ) {

                event.preventDefault();

                const firstInvalidField =
                    form.querySelector(":invalid");

                if (firstInvalidField) {
                    firstInvalidField.focus();
                }

                form.reportValidity();
            }

        });

    });

});