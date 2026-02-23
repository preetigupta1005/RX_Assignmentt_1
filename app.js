const logOut = document.querySelector(".logOut");
const sidebarAarrow = document.querySelector(".sidebar-arrow");
const formAddDoc = document.querySelector(".formAddDoc");
const navAddDocButt = document.querySelector(".navAddDocButt");
const cancelbtn = document.getElementById("cancelButton");
const form = document.getElementById("form_01");
const tbody = document.querySelector("tbody");
const editDltDiv = document.querySelector(".editDltDiv");
const dots = document.querySelector(".dots");
const formHeader = document.getElementById("formHeader");
const addButton = document.getElementById("addButton");
const searchInput = document.getElementById("searchInput");
//1. logout toggle

sidebarAarrow.addEventListener("click", function (e) {
  e.stopPropagation();
  logOut.classList.toggle("show");
});
// Close logout when clicking anywhere else
document.addEventListener("click", function (e) {
  // If click is NOT inside arrow and NOT inside logout menu
  if (!e.target.closest(".sidebarArrow") && !e.target.closest(".logOut")) {
    logOut.classList.remove("show");
  }
});

//2. Add form toggle
navAddDocButt.addEventListener("click", function () {
  formAddDoc.classList.toggle("hide");
});

cancelbtn.addEventListener("click", () => {
  formAddDoc.classList.toggle("hide");
});

//3. 3 dots toggle + on off logic

tbody.addEventListener("click", function (e) {
  // Check if 3 dots clicked
  let dots = e.target.closest(".dots");
  //  If dots clicked
  if (dots) {
    let currentRow = dots.closest("tr");
    let currentMenu = currentRow.querySelector(".editDltDiv");

    // Close all other menus first
    document.querySelectorAll(".editDltDiv").forEach(function (menu) {
      if (menu !== currentMenu) {
        menu.classList.add("hide");
      }
    });

    // Toggle current menu
    currentMenu.classList.toggle("hide");
  }
});

// Close menu when clicking anywhere outside
document.addEventListener("click", function (e) {
  // If click is NOT inside .dots AND NOT inside .editDltDiv
  if (!e.target.closest(".dots") && !e.target.closest(".editDltDiv")) {
    document.querySelectorAll(".editDltDiv").forEach(function (menu) {
      menu.classList.add("hide");
    });
  }
});

//4. deleting details
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    // Get index
    let index = e.target.dataset.index;

    // Get data from localStorage
    let details = JSON.parse(localStorage.getItem("docDetails")) || [];

    // Remove item
    details.splice(index, 2);

    // Save updated data
    localStorage.setItem("docDetails", JSON.stringify(details));

    // Remove row from DOM
    let row = e.target.closest("tr");
    row.remove();
  }
});

//5. edit doc (this just show to pick index and store that row data in docname and status var and open form withese value )
// after form reopen so add in same row functionality done in submit form part
let editIndex = null;
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit")) {
    // Get index
    editIndex = e.target.dataset.index;

    // Get data
    let details = JSON.parse(localStorage.getItem("docDetails")) || [];

    let item = details[editIndex];

    // Fill form fields
    form.docname.value = item.name;
    form.status.value = item.status;

    // CHANGE HEADING + BUTTON text
    formHeader.textContent = "Edit Document";
    addButton.textContent = "Edit";

    // Show form
    formAddDoc.classList.remove("hide");
  }
});
//6. searchBox functionality

searchInput.addEventListener("keyup", function () {
  let searchValue = this.value.toLowerCase();

  let details = JSON.parse(localStorage.getItem("docDetails")) ?? [];

  let filteredData = details.filter((item) =>
    item.name.toLowerCase().includes(searchValue),
  );

  displayData(filteredData);
});

//7. submit form row will show functionality

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = e.target.docname.value;
  let status = e.target.status.value;
  if (!name || status === "Select Status") {
    alert("Please fill all fields");
    return;
  }
  let details = JSON.parse(localStorage.getItem("docDetails")) ?? [];
  // If Editing
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
  localStorage.setItem("docDetails", JSON.stringify(details));
  form.reset();
  displayData();
  formAddDoc.classList.add("hide");
});

//8. Display data {here data for search input box if anything in search so show only that otherwise all}

let displayData = (data) => {
  let details = data || (JSON.parse(localStorage.getItem("docDetails")) ?? []);
  let finalData = "";
  details.forEach((element, i) => {
    let status_class = "";
    let signNow_class = "";
    if (element.status == "Pending") {
      status_class = "pending";
      signNow_class = "Preview";
    } else if (element.status == "Needs Signing") {
      status_class = "need-signing";
      signNow_class = "Sign Now";
    } else if (element.status == "Completed") {
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

    tbody.innerHTML = finalData;
  });
};

displayData();
