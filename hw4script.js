// =====================
// DATE
// =====================
const currentDate = new Date();
document.getElementById("date").textContent = currentDate.toLocaleDateString();

const today = new Date();
const maxDate = today.toISOString().split("T")[0];
const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
    .toISOString().split("T")[0];
document.getElementById("dob").setAttribute("max", maxDate);
document.getElementById("dob").setAttribute("min", minDate);


// =====================
// FETCH API - Load States
// =====================
fetch("states.html")
    .then(response => {
        if (!response.ok) throw new Error("Could not load states.");
        return response.text();
    })
    .then(html => {
        document.getElementById("state").innerHTML = html;
        // After states load, restore saved state from local storage if it exists
        let savedState = localStorage.getItem("state");
        if (savedState) {
            document.getElementById("state").value = savedState;
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
        document.getElementById("stateError").textContent = "Could not load state list.";
    });


// =====================
// COOKIES
// =====================
function setCookie(name, value, hours) {
    let expires = "";
    if (hours) {
        let date = new Date();
        date.setTime(date.getTime() + hours * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length));
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}


// =====================
// PAGE LOAD - Check Cookie and Restore Local Storage
// =====================
window.onload = function () {
    let savedName = getCookie("fname");

    if (savedName) {
        // Returning user
        document.getElementById("welcomeMsg").textContent = "Welcome back, " + savedName + "!";
        document.getElementById("fname").value = savedName;

        // Show "Not [name]?" checkbox
        document.getElementById("newUserDiv").style.display = "block";
        document.getElementById("notMeLabel").textContent =
            "Not " + savedName + "? Click here to start as a new user.";

        // Restore all local storage values
        restoreFromStorage();
    } else {
        // New user
        document.getElementById("welcomeMsg").textContent = "Welcome, New User!";
    }
};


// =====================
// NOT ME - Clear cookie and storage
// =====================
function handleNotMe() {
    let checkbox = document.getElementById("notMeCheck");
    if (checkbox.checked) {
        deleteCookie("fname");
        clearStorage();
        document.getElementById("welcomeMsg").textContent = "Welcome, New User!";
        document.getElementById("newUserDiv").style.display = "none";
        document.registration.reset();
        clearAllErrors();
        document.getElementById("submitBtn").style.display = "none";
    }
}


// =====================
// LOCAL STORAGE - Save and Restore
// =====================
function saveToStorage(fieldId) {
    let val = document.getElementById(fieldId).value;
    localStorage.setItem(fieldId, val);
}

function saveCheckboxes() {
    let checkboxIds = ["allergy1", "allergy2", "allergy3", "otherallergy", "none"];
    let checked = checkboxIds.filter(id => document.getElementById(id).checked);
    localStorage.setItem("allergies", JSON.stringify(checked));
}

function restoreFromStorage() {
    let fields = [
        "fname", "mi", "lname", "dob", "address1", "address2",
        "city", "zip", "email", "phone", "desc", "userid", "health"
    ];

    fields.forEach(id => {
        let val = localStorage.getItem(id);
        if (val) {
            document.getElementById(id).value = val;
        }
    });

    // Restore health slider display
    let health = localStorage.getItem("health");
    if (health) {
        document.getElementById("healthValue").textContent = health;
    }

    // Restore state (handled after fetch loads)
    let savedState = localStorage.getItem("state");
    if (savedState) {
        document.getElementById("state").value = savedState;
    }

    // Restore checkboxes
    let savedAllergies = localStorage.getItem("allergies");
    if (savedAllergies) {
        let checked = JSON.parse(savedAllergies);
        checked.forEach(id => {
            let el = document.getElementById(id);
            if (el) el.checked = true;
        });
    }

    // Restore radio buttons
    let savedGender = localStorage.getItem("gender");
    if (savedGender) {
        let el = document.querySelector('input[name="gender"][value="' + savedGender + '"]');
        if (el) el.checked = true;
    }

    let savedVaccine = localStorage.getItem("vaccine");
    if (savedVaccine) {
        let el = document.querySelector('input[name="vaccine"][value="' + savedVaccine + '"]');
        if (el) el.checked = true;
    }

    let savedInsurance = localStorage.getItem("insurance");
    if (savedInsurance) {
        let el = document.querySelector('input[name="insurance"][value="' + savedInsurance + '"]');
        if (el) el.checked = true;
    }
}

function clearStorage() {
    let fields = [
        "fname", "mi", "lname", "dob", "address1", "address2",
        "city", "state", "zip", "email", "phone", "desc",
        "userid", "health", "allergies", "gender", "vaccine", "insurance"
    ];
    fields.forEach(id => localStorage.removeItem(id));
}


// =====================
// REMEMBER ME - Save cookie on submit
// =====================
function handleRememberMe() {
    let rememberMe = document.getElementById("rememberMe").checked;
    let fname = document.getElementById("fname").value.trim();

    if (rememberMe && fname !== "") {
        setCookie("fname", fname, 48);
    } else {
        deleteCookie("fname");
        clearStorage();
    }
}


// =====================
// ERROR HELPERS
// =====================
function showError(id, msg) {
    document.getElementById(id).textContent = msg;
}
function clearError(id) {
    document.getElementById(id).textContent = "";
}


// =====================
// SLIDER
// =====================
function updateHealth(value) {
    document.getElementById("healthValue").textContent = value;
}


// =====================
// SSN AUTO FORMAT
// =====================
function formatSSN(input) {
    let val = input.value.replace(/\D/g, "");
    if (val.length > 3 && val.length <= 5) {
        val = val.slice(0, 3) + "-" + val.slice(3);
    } else if (val.length > 5) {
        val = val.slice(0, 3) + "-" + val.slice(3, 5) + "-" + val.slice(5, 9);
    }
    input.value = val;
}


// =====================
// VALIDATORS
// =====================
function validateFname() {
    let val = document.getElementById("fname").value.trim();
    if (val === "") {
        showError("fnameError", "First name is required.");
        return false;
    } else if (!/^[A-Za-z'-]{1,30}$/.test(val)) {
        showError("fnameError", "First name: letters, apostrophes, and dashes only.");
        return false;
    }
    clearError("fnameError");
    return true;
}

function validateMi() {
    let val = document.getElementById("mi").value.trim();
    if (val !== "" && !/^[A-Za-z]$/.test(val)) {
        showError("miError", "Middle initial must be one letter only.");
        return false;
    }
    clearError("miError");
    return true;
}

function validateLname() {
    let val = document.getElementById("lname").value.trim();
    if (val === "") {
        showError("lnameError", "Last name is required.");
        return false;
    } else if (!/^[A-Za-z'-]{1,30}$/.test(val)) {
        showError("lnameError", "Last name: letters, apostrophes, and dashes only.");
        return false;
    }
    clearError("lnameError");
    return true;
}

function validateDob() {
    let val = document.getElementById("dob").value;
    if (val === "") {
        showError("dobError", "Date of birth is required.");
        return false;
    } else if (val > maxDate) {
        showError("dobError", "Date of birth cannot be in the future.");
        return false;
    } else if (val < minDate) {
        showError("dobError", "Date of birth cannot be more than 120 years ago.");
        return false;
    }
    clearError("dobError");
    return true;
}

function validateSSN() {
    let val = document.getElementById("social").value.replace(/\D/g, "");
    if (val === "") {
        showError("socialError", "Social Security Number is required.");
        return false;
    } else if (val.length !== 9) {
        showError("socialError", "SSN must be exactly 9 digits.");
        return false;
    }
    clearError("socialError");
    return true;
}

function validateAddress1() {
    let val = document.getElementById("address1").value.trim();
    if (val === "") {
        showError("address1Error", "Street address is required.");
        return false;
    } else if (val.length < 2) {
        showError("address1Error", "Street address must be at least 2 characters.");
        return false;
    }
    clearError("address1Error");
    return true;
}

function validateAddress2() {
    let val = document.getElementById("address2").value.trim();
    if (val !== "" && val.length < 2) {
        showError("address2Error", "If entered, address line 2 must be at least 2 characters.");
        return false;
    }
    clearError("address2Error");
    return true;
}

function validateCity() {
    let val = document.getElementById("city").value.trim();
    if (val === "") {
        showError("cityError", "City is required.");
        return false;
    } else if (val.length < 2) {
        showError("cityError", "City must be at least 2 characters.");
        return false;
    }
    clearError("cityError");
    return true;
}

function validateState() {
    let val = document.getElementById("state").value;
    if (val === "") {
        showError("stateError", "Please select a state.");
        return false;
    }
    clearError("stateError");
    return true;
}

function validateZip() {
    let val = document.getElementById("zip").value.trim();
    if (val === "") {
        showError("zipError", "ZIP code is required.");
        return false;
    } else if (!/^\d{5}(-\d{4})?$/.test(val)) {
        showError("zipError", "ZIP code must be 5 digits or ZIP+4 format.");
        return false;
    }
    clearError("zipError");
    return true;
}

function validateEmail() {
    let val = document.getElementById("email").value.trim().toLowerCase();
    document.getElementById("email").value = val;
    if (val === "") {
        showError("emailError", "Email address is required.");
        return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        showError("emailError", "Email must be in the format name@domain.com");
        return false;
    }
    clearError("emailError");
    return true;
}

function validatePhone() {
    let val = document.getElementById("phone").value.trim();
    if (val === "") {
        showError("phoneError", "Phone number is required.");
        return false;
    } else if (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(val)) {
        showError("phoneError", "Phone must be in format 123-456-7890.");
        return false;
    }
    clearError("phoneError");
    return true;
}

function validateDesc() {
    let val = document.getElementById("desc").value;
    if (/<[^>]*>/.test(val)) {
        showError("descError", "Symptoms cannot contain HTML tags.");
        return false;
    }
    clearError("descError");
    return true;
}

function validateGender() {
    let selected = document.querySelector('input[name="gender"]:checked');
    if (!selected) {
        showError("genderError", "Please select a gender.");
        return false;
    }
    clearError("genderError");
    return true;
}

function validateVaccine() {
    let selected = document.querySelector('input[name="vaccine"]:checked');
    if (!selected) {
        showError("vaccineError", "Please indicate vaccination status.");
        return false;
    }
    clearError("vaccineError");
    return true;
}

function validateInsurance() {
    let selected = document.querySelector('input[name="insurance"]:checked');
    if (!selected) {
        showError("insuranceError", "Please indicate insurance status.");
        return false;
    }
    clearError("insuranceError");
    return true;
}

function validateUserid() {
    let val = document.getElementById("userid").value.trim();
    if (val === "") {
        showError("useridError", "User ID is required.");
        return false;
    } else if (!/^[A-Za-z]/.test(val)) {
        showError("useridError", "User ID must start with a letter.");
        return false;
    } else if (val.length < 5) {
        showError("useridError", "User ID must be at least 5 characters.");
        return false;
    } else if (/[^A-Za-z0-9_-]/.test(val)) {
        showError("useridError", "User ID can only contain letters, numbers, underscores, and dashes.");
        return false;
    }
    clearError("useridError");
    return true;
}

function validatePassword() {
    let pass = document.getElementById("password").value;
    let userid = document.getElementById("userid").value;
    const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%^&*()\-_+=\/><.,`~])[^"]{8,30}$/;

    if (pass === "") {
        showError("passwordError", "Password is required.");
        return false;
    } else if (!strongPass.test(pass)) {
        showError("passwordError", "Password must be 8-30 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character. No double quotes.");
        return false;
    } else if (userid.length > 0 && pass.toLowerCase().includes(userid.toLowerCase())) {
        showError("passwordError", "Password cannot contain your User ID.");
        return false;
    }
    clearError("passwordError");
    if (document.getElementById("repassword").value !== "") {
        validateRepassword();
    }
    return true;
}

function validateRepassword() {
    let pass = document.getElementById("password").value;
    let repass = document.getElementById("repassword").value;
    if (repass === "") {
        showError("repasswordError", "Please re-enter your password.");
        return false;
    } else if (pass !== repass) {
        showError("repasswordError", "Passwords do not match.");
        return false;
    }
    clearError("repasswordError");
    return true;
}


// =====================
// VALIDATE ALL
// =====================
function validateAll() {
    let ok = true;
    if (!validateFname()) ok = false;
    if (!validateMi()) ok = false;
    if (!validateLname()) ok = false;
    if (!validateDob()) ok = false;
    if (!validateSSN()) ok = false;
    if (!validateAddress1()) ok = false;
    if (!validateAddress2()) ok = false;
    if (!validateCity()) ok = false;
    if (!validateState()) ok = false;
    if (!validateZip()) ok = false;
    if (!validateEmail()) ok = false;
    if (!validatePhone()) ok = false;
    if (!validateDesc()) ok = false;
    if (!validateGender()) ok = false;
    if (!validateVaccine()) ok = false;
    if (!validateInsurance()) ok = false;
    if (!validateUserid()) ok = false;
    if (!validatePassword()) ok = false;
    if (!validateRepassword()) ok = false;

    if (ok) {
        document.getElementById("submitBtn").style.display = "inline-block";
        alert("All fields are valid. You may now submit.");
    } else {
        document.getElementById("submitBtn").style.display = "none";
        alert("Please fix the errors shown on the form before submitting.");
    }
}


// =====================
// FINAL SUBMIT CHECK
// =====================
function finalSubmitCheck() {
    let ok = true;
    if (!validateFname()) ok = false;
    if (!validateMi()) ok = false;
    if (!validateLname()) ok = false;
    if (!validateDob()) ok = false;
    if (!validateSSN()) ok = false;
    if (!validateAddress1()) ok = false;
    if (!validateAddress2()) ok = false;
    if (!validateCity()) ok = false;
    if (!validateState()) ok = false;
    if (!validateZip()) ok = false;
    if (!validateEmail()) ok = false;
    if (!validatePhone()) ok = false;
    if (!validateDesc()) ok = false;
    if (!validateGender()) ok = false;
    if (!validateVaccine()) ok = false;
    if (!validateInsurance()) ok = false;
    if (!validateUserid()) ok = false;
    if (!validatePassword()) ok = false;
    if (!validateRepassword()) ok = false;

    if (ok) handleRememberMe();
    return ok;
}


// =====================
// CLEAR ALL ERRORS
// =====================
function clearAllErrors() {
    const errorIds = [
        "fnameError", "miError", "lnameError", "dobError", "socialError",
        "address1Error", "address2Error", "cityError", "stateError", "zipError",
        "emailError", "phoneError", "descError", "genderError", "vaccineError",
        "insuranceError", "useridError", "passwordError", "repasswordError"
    ];
    errorIds.forEach(id => clearError(id));
    document.getElementById("submitBtn").style.display = "none";
}


// =====================
// STATUS HELPER
// =====================
function status(ok) {
    return ok
        ? '<span style="color:green; font-weight:bold;">pass</span>'
        : '<span style="color:red; font-weight:bold;">ERROR</span>';
}


// =====================
// REVIEW FORM
// =====================
function reviewForm() {
    let fname = document.getElementById("fname").value;
    let mi = document.getElementById("mi").value;
    let lname = document.getElementById("lname").value;
    let dob = document.getElementById("dob").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let address1 = document.getElementById("address1").value;
    let address2 = document.getElementById("address2").value;
    let city = document.getElementById("city").value;
    let state = document.getElementById("state").value;
    let zip = document.getElementById("zip").value;
    let symptoms = document.getElementById("desc").value.trim();
    let userid = document.getElementById("userid").value;
    let health = document.getElementById("health").value;

    let allergyList = [];
    if (document.getElementById("none").checked) {
        allergyList = ["None"];
    } else {
        if (document.getElementById("allergy1").checked) allergyList.push("Peanuts");
        if (document.getElementById("allergy2").checked) allergyList.push("Shellfish");
        if (document.getElementById("allergy3").checked) allergyList.push("Pollen");
        if (document.getElementById("otherallergy").checked) allergyList.push("Other");
    }
    let allergies = allergyList.length > 0 ? allergyList.join(", ") : "None selected";

    let genderRadio = document.querySelector('input[name="gender"]:checked');
    let gender = genderRadio ? genderRadio.value : "";

    let vaccineRadio = document.querySelector('input[name="vaccine"]:checked');
    let vaccine = vaccineRadio ? vaccineRadio.value : "";

    let insuranceRadio = document.querySelector('input[name="insurance"]:checked');
    let insurance = insuranceRadio ? insuranceRadio.value : "";

    let nameOk = fname.trim() !== "" && lname.trim() !== "";
    let dobOk = dob !== "" && dob <= maxDate && dob >= minDate;
    let emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    let phoneOk = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phone);
    let addressOk = address1.trim().length >= 2 && city.trim().length >= 2 && state !== "" && /^\d{5}(-\d{4})?$/.test(zip);
    let genderOk = gender !== "";
    let vaccineOk = vaccine !== "";
    let insuranceOk = insurance !== "";
    let useridOk = /^[A-Za-z][A-Za-z0-9_-]{4,19}$/.test(userid);

    document.getElementById("reviewName").innerHTML = fname + " " + (mi ? mi + " " : "") + lname;
    document.getElementById("reviewNameStatus").innerHTML = status(nameOk);
    document.getElementById("reviewDob").innerHTML = dob || "Missing";
    document.getElementById("reviewDobStatus").innerHTML = status(dobOk);
    document.getElementById("reviewEmail").innerHTML = email || "Missing";
    document.getElementById("reviewEmailStatus").innerHTML = status(emailOk);
    document.getElementById("reviewPhone").innerHTML = phone || "Missing";
    document.getElementById("reviewPhoneStatus").innerHTML = status(phoneOk);
    document.getElementById("reviewAddress").innerHTML =
        (address1 || "Missing") + "<br>" +
        (address2 ? address2 + "<br>" : "") +
        (city || "Missing") + ", " + (state || "Missing") + " " + (zip || "Missing");
    document.getElementById("reviewAddressStatus").innerHTML = status(addressOk);
    document.getElementById("reviewAllergies").innerHTML = allergies;
    document.getElementById("reviewGender").innerHTML = gender || "Not selected";
    document.getElementById("reviewGenderStatus").innerHTML = status(genderOk);
    document.getElementById("reviewVaccine").innerHTML = vaccine || "Not selected";
    document.getElementById("reviewVaccineStatus").innerHTML = status(vaccineOk);
    document.getElementById("reviewInsurance").innerHTML = insurance || "Not selected";
    document.getElementById("reviewInsuranceStatus").innerHTML = status(insuranceOk);
    document.getElementById("reviewHealth").innerHTML = health + " / 10";
    document.getElementById("reviewSymptoms").innerHTML = symptoms || "None";

    let useridMsg = "";
    if (!userid) useridMsg = "ERROR: Missing";
    else if (!/^[A-Za-z]/.test(userid)) useridMsg = "ERROR: Must start with a letter";
    else if (userid.length < 5) useridMsg = "ERROR: Must be at least 5 characters";
    else if (/[^A-Za-z0-9_-]/.test(userid)) useridMsg = "ERROR: Only letters, numbers, underscores, and dashes allowed";

    document.getElementById("reviewUser").innerHTML = userid || "Missing";
    document.getElementById("reviewUserStatus").innerHTML = useridOk
        ? '<span style="color:green; font-weight:bold;">pass</span>'
        : '<span style="color:red; font-weight:bold;">' + useridMsg + '</span>';

    document.getElementById("reviewArea").scrollIntoView({ behavior: "smooth" });
}