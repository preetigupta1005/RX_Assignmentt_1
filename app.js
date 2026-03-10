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
const lastModifiedInput = document.getElementById("lastModified");
//addEventListener("change", ...) runs when the dropdown value changes.
if (statusSelect && pendingDiv) {
    statusSelect === null || statusSelect === void 0 ? void 0 : statusSelect.addEventListener("change", () => {
        if (statusSelect.value === Status.PENDING) {
            pendingDiv === null || pendingDiv === void 0 ? void 0 : pendingDiv.classList.remove("hide");
        }
        else {
            pendingDiv === null || pendingDiv === void 0 ? void 0 : pendingDiv.classList.add("hide");
        }
    });
}
let editIndex = null;
//Function for Getting Data .... JSON.parse() expects a string ... converts string to real array:
const getDocDetails = () => {
    var _a;
    return JSON.parse((_a = localStorage.getItem("docDetails")) !== null && _a !== void 0 ? _a : "[]");
};
//Function for Saving Data
const setDocDetails = (data) => {
    localStorage.setItem("docDetails", JSON.stringify(data));
};
const Status = {
    PENDING: "Pending",
    NEEDS_SIGNING: "Needs Signing",
    COMPLETED: "Completed",
};
// logout toggle
sidebarAarrow === null || sidebarAarrow === void 0 ? void 0 : sidebarAarrow.addEventListener("click", function (e) {
    e.stopPropagation();
    logOut === null || logOut === void 0 ? void 0 : logOut.classList.toggle("hide");
});
//Add doc button toggle so form display
navAddDocButt === null || navAddDocButt === void 0 ? void 0 : navAddDocButt.addEventListener("click", function () {
    formAddDoc === null || formAddDoc === void 0 ? void 0 : formAddDoc.classList.toggle("hide");
    if (lastModifiedInput) {
        lastModifiedInput.value = new Date().toLocaleString();
    }
});
//cancel button of form
cancelbtn === null || cancelbtn === void 0 ? void 0 : cancelbtn.addEventListener("click", () => {
    formAddDoc === null || formAddDoc === void 0 ? void 0 : formAddDoc.classList.toggle("hide");
    form === null || form === void 0 ? void 0 : form.reset();
    editIndex = null;
    if (formHeader && addButton) {
        formHeader.textContent = "Add Document";
        addButton.textContent = "Add";
    }
    pendingDiv === null || pendingDiv === void 0 ? void 0 : pendingDiv.classList.add("hide");
});
document.addEventListener("click", function (e) {
    const target = e.target;
    // If click is NOT inside arrow and NOT inside logout menu
    if (!target.closest(".sidebarArrow") && !target.closest(".logOut")) {
        logOut === null || logOut === void 0 ? void 0 : logOut.classList.add("hide");
    }
    // Close menu when clicking anywhere outside
    // If click is NOT inside .dots AND NOT inside .editDltDiv
    if (!target.closest(".dots") && !target.closest(".editDltDiv")) {
        document.querySelectorAll(".editDltDiv").forEach(function (menu) {
            menu.classList.add("hide");
        });
    }
    // deleting details
    if (target.closest(".delete")) {
        // Get index
        const dltBtn = target.closest(".delete");
        const indexValue = dltBtn.dataset.index;
        // Get data from localStorage
        const details = getDocDetails();
        // Remove item
        details.splice(Number(indexValue), 1);
        // Save updated data
        setDocDetails(details);
        displayData();
    }
    //5. edit doc (this just show to pick index and store that row data in docname and status var and open form withese value )
    // after form reopen so add in same row functionality done in submit form part
    if (target.closest(".edit")) {
        // Get index
        const editBtn = target.closest(".edit");
        const indexValue = editBtn.dataset.index;
        editIndex = Number(indexValue);
        // Get data
        const details = getDocDetails();
        const item = details[editIndex];
        if (!form || !formHeader || !addButton || !formAddDoc)
            return;
        // Fill form fields
        form.docname.value = item === null || item === void 0 ? void 0 : item.name;
        form.status.value = item === null || item === void 0 ? void 0 : item.status;
        const waitingInput = form.num;
        if ((item === null || item === void 0 ? void 0 : item.status) === Status.PENDING) {
            pendingDiv === null || pendingDiv === void 0 ? void 0 : pendingDiv.classList.remove("hide");
            waitingInput.value = item.waiting ? String(item.waiting) : "";
        }
        else {
            pendingDiv === null || pendingDiv === void 0 ? void 0 : pendingDiv.classList.add("hide");
            waitingInput.value = "";
        }
        // CHANGE HEADING + BUTTON text
        formHeader.textContent = "Edit Document";
        addButton.textContent = "Edit";
        const now = new Date().toLocaleString();
        if (lastModifiedInput) {
            lastModifiedInput.value = now;
        }
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
        const name = target.docname.value;
        const status = target.status.value;
        const waiting = target.num;
        const now = new Date().toLocaleString();
        const details = getDocDetails();
        const newItem = {
            name,
            status,
            lastModified: now,
        };
        if (status === Status.PENDING) {
            newItem.waiting = Number(waiting.value);
        }
        if (editIndex !== null) {
            details[editIndex] = newItem;
        }
        else {
            details.push(newItem);
        }
        setDocDetails(details);
        displayData();
        // reset everything in one place
        form.reset();
        pendingDiv === null || pendingDiv === void 0 ? void 0 : pendingDiv.classList.add("hide");
        editIndex = null;
        if (formHeader && addButton) {
            formHeader.textContent = "Add Document";
            addButton.textContent = "Add";
        }
        formAddDoc === null || formAddDoc === void 0 ? void 0 : formAddDoc.classList.add("hide");
    });
}
//Display data {here data for search input box if anything in search so show only that otherwise all}
function displayData(data) {
    let details = data !== null && data !== void 0 ? data : getDocDetails();
    let finalData = "";
    details.forEach((element, i) => {
        let status_class = "";
        let signNow_class = "";
        let waitingDiv = "";
        if (element.status == Status.PENDING) {
            status_class = "pending";
            signNow_class = "Preview";
        }
        else if (element.status == Status.NEEDS_SIGNING) {
            status_class = "need-signing";
            signNow_class = "Sign Now";
        }
        else if (element.status == Status.COMPLETED) {
            status_class = "Completed";
            signNow_class = "Download PDF";
        }
        finalData += ` <tr class="row">
                            <td class="check">
                                <input type="checkbox">
                            </td>
                            <td class="doc">
                                ${element.name}
                            </td>
                            <td class="StatusDiv">
                                
                                <div><span class="status ${status_class}" >${element.status}</span></div>
                                <div>${element.status === Status.PENDING &&
            element.waiting
            ? `<div class="W1">Waiting for <span class="W2"> ${element.waiting} </span> persons</div>`
            : ""}</div>
                            </td>
                            <td class="date">
                                  ${element.lastModified}
                            </td>
                            <td class="but-div">
                                <button class="but">${signNow_class}</button>
                            </td>
                            <td>
                            <div class="dots"><img src="Assest/Icons/more_vert_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 2.png" class="dots-img">
                                <div class="editDltDiv hide">
                                    <div class="edit" data-index="${i}"><img src="Assest/Icons/edit.png"/>Edit</div>
                                    <div class="delete" data-index="${i}"><img src="Assest/Icons/delete.png" />Delete</div>
                                </div>
                              </div>  
                            </td>
                        </tr>`;
    });
    if (tbody)
        tbody.innerHTML = finalData;
}
;
displayData();
export {};
//# sourceMappingURL=app.js.map