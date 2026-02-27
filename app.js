"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
const logOut = document.querySelector(".logOut");
const sidebarAarrow = document.querySelector(".sidebar-arrow");
const formAddDoc = document.querySelector(".formAddDoc");
const navAddDocButt = document.querySelector(".navAddDocButt");
const cancelbtn = document.getElementById("cancelButton");
const form = document.querySelector("#form_01");
const tbody = document.querySelector("tbody");
const formHeader = document.getElementById("formHeader");
const addButton = document.getElementById("addButton");
const searchInput = document.getElementById("searchInput");
const statusSelect = document.querySelector("#Status");
const pendingDiv = document.querySelector(".for-pending");
if (statusSelect && pendingDiv) {
    statusSelect.addEventListener("change", () => {
        if (statusSelect.value === "Pending") {
            pendingDiv.classList.remove("hide");
        }
        else {
            pendingDiv.classList.add("hide");
        }
    });
}
let editIndex = null;
//Function for Getting Data
const getDocDetails = () => {
    var _a;
    return JSON.parse((_a = localStorage.getItem("docDetails")) !== null && _a !== void 0 ? _a : "[]");
};
//Function for Sving Data
const setDocDetails = (data) => {
    localStorage.setItem("docDetails", JSON.stringify(data));
};
//in ts we use ? means if it null it simply does nothing
//1. logout toggle
sidebarAarrow === null || sidebarAarrow === void 0 ? void 0 : sidebarAarrow.addEventListener("click", function (e) {
    e.stopPropagation();
    logOut === null || logOut === void 0 ? void 0 : logOut.classList.toggle("show");
});
//2. Add doc button toggle so form display
navAddDocButt === null || navAddDocButt === void 0 ? void 0 : navAddDocButt.addEventListener("click", function () {
    formAddDoc === null || formAddDoc === void 0 ? void 0 : formAddDoc.classList.toggle("hide");
});
//3. cancel form of form
cancelbtn === null || cancelbtn === void 0 ? void 0 : cancelbtn.addEventListener("click", () => {
    formAddDoc === null || formAddDoc === void 0 ? void 0 : formAddDoc.classList.toggle("hide");
});
document.addEventListener("click", function (e) {
    const target = e.target;
    // If click is NOT inside arrow and NOT inside logout menu
    if (!target.closest(".sidebarArrow") && !target.closest(".logOut")) {
        logOut === null || logOut === void 0 ? void 0 : logOut.classList.remove("show");
    }
    // Close menu when clicking anywhere outside
    // If click is NOT inside .dots AND NOT inside .editDltDiv
    if (!target.closest(".dots") && !target.closest(".editDltDiv")) {
        document.querySelectorAll(".editDltDiv").forEach(function (menu) {
            menu.classList.add("hide");
        });
    }
    //4. deleting details
    if (target.classList.contains("delete")) {
        // Get index
        const index = target.dataset.index;
        // Get data from localStorage
        let details = getDocDetails();
        // Remove item
        details.splice(Number(index), 1);
        // Save updated data
        setDocDetails(details);
        // Remove row from DOM
        let row = target.closest("tr");
        row === null || row === void 0 ? void 0 : row.remove();
    }
    //5. edit doc (this just show to pick index and store that row data in docname and status var and open form withese value )
    // after form reopen so add in same row functionality done in submit form part
    if (target.classList.contains("edit")) {
        // Get index
        const indexValue = target.dataset.index;
        if (!indexValue)
            return;
        editIndex = Number(indexValue);
        // Get data
        let details = getDocDetails();
        let item = details[editIndex];
        if (!form || !formHeader || !addButton || !formAddDoc)
            return;
        // Fill form fields
        form.docname.value = item === null || item === void 0 ? void 0 : item.name;
        form.status.value = item === null || item === void 0 ? void 0 : item.status;
        // CHANGE HEADING + BUTTON text
        formHeader.textContent = "Edit Document";
        addButton.textContent = "Edit";
        // Show form
        formAddDoc.classList.remove("hide");
    }
});
//3 dots toggle + on off logic
tbody === null || tbody === void 0 ? void 0 : tbody.addEventListener("click", function (e) {
    // Check if 3 dots clicked
    const target = e.target;
    let dots = target.closest(".dots");
    //  If dots clicked
    if (dots) {
        let currentRow = dots.closest("tr");
        if (!currentRow)
            return null;
        let currentMenu = currentRow.querySelector(".editDltDiv");
        // Close all other menus first
        document.querySelectorAll(".editDltDiv").forEach(function (menu) {
            if (menu !== currentMenu) {
                menu.classList.add("hide");
            }
        });
        // Toggle current menu
        currentMenu === null || currentMenu === void 0 ? void 0 : currentMenu.classList.toggle("hide");
    }
});
//6. searchBox functionality
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("keyup", (e) => {
    const target = e.target;
    const searchValue = target.value.toLowerCase();
    const details = getDocDetails();
    const filteredData = details.filter((item) => item.name.toLowerCase().includes(searchValue));
    displayData(filteredData);
});
//7. submit form row will show functionality
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = e.target;
        let name = target.docname.value;
        let status = target.status.value;
        let waiting = target.num;
        if (!name || status === "Select Status") {
            alert("Please fill all fields");
            return;
        }
        let details = getDocDetails();
        const newItem = {
            name,
            status,
        };
        if (status === "Pending") {
            newItem.waiting = Number(waiting.value);
        }
        if (editIndex !== null) {
            details[editIndex] = newItem;
            editIndex = null;
        }
        else {
            details.push(newItem);
        }
        // If Editing
        if (!formHeader || !addButton || !formAddDoc)
            return;
        if (editIndex !== null) {
            //to change from edit doc to add doc back
            formHeader.textContent = "Add Document";
            addButton.textContent = "Add";
            details[editIndex] = {
                name: name,
                status: status,
            };
            editIndex = null; // reset after editing
        }
        // If Adding New
        else {
            details.push({
                name: name,
                status: status,
            });
        }
        setDocDetails(details);
        form.reset();
        displayData();
        formAddDoc.classList.add("hide");
    });
}
//8. Display data {here data for search input box if anything in search so show only that otherwise all}
let displayData = (data) => {
    let details = data !== null && data !== void 0 ? data : getDocDetails();
    let finalData = "";
    details.forEach((element, i) => {
        let status_class = "";
        let signNow_class = "";
        let waitingDiv = "";
        if (element.status == "Pending") {
            status_class = "pending";
            signNow_class = "Preview";
        }
        else if (element.status == "Needs Signing") {
            status_class = "need-signing";
            signNow_class = "Sign Now";
        }
        else if (element.status == "Completed") {
            status_class = "Completed";
            signNow_class = "Download PDF";
        }
        let d = new Date().toLocaleDateString();
        let t = new Date().toLocaleTimeString();
        finalData += ` <tr class="row">
                            <td class="check">
                                <input type="checkbox">
                            </td>
                            <td class="doc">
                                ${element.name}
                            </td>
                            <td class="">
                                
                                <span class="status ${status_class}" >${element.status}</span>
                                ${element.status === "Pending" &&
            element.waiting
            ? `<div class="W1">Waiting for <span class="W2"> ${element.waiting} </span> persons</div>`
            : ""}
                            </td>
                            <td class="date">
                                ${d}<br>${t}
                            </td>
                            <td class="but-div">
                                <button class="but">${signNow_class}</button>
                            </td>
                            <td>
                            <div class="dots"><img src="Assest/Icons/more_vert_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 2.png" class="dots-img">
                                <div class="editDltDiv hide">
                                    <button class="edit" data-index="${i}">Edit</button>
                                    <button class="delete" data-index="${i}">Delete</button>
                                </div>
                              </div>
                            </td>
                        </tr>`;
    });
    if (tbody)
        tbody.innerHTML = finalData;
};
displayData();
//# sourceMappingURL=app.js.map