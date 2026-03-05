const logOut = document.querySelector<HTMLElement>(".logOut");
const sidebarAarrow = document.querySelector<HTMLElement>(".sidebar-arrow");
const formAddDoc = document.querySelector<HTMLElement>(".formAddDoc");
const navAddDocButt = document.querySelector<HTMLElement>(".navAddDocButt");
const cancelbtn = document.getElementById("cancelButton");
const form = document.querySelector<HTMLFormElement>("#form_01");
const tbody = document.querySelector<HTMLTableSectionElement>("tbody");
const formHeader = document.getElementById("formHeader");
const addButton = document.getElementById("addButton");
const searchInput = document.getElementById("searchInput");
const statusSelect = document.querySelector<HTMLSelectElement>("#Status");
const pendingDiv = document.querySelector<HTMLElement>(".for-pending");
const lastModifiedInput = document.getElementById(
  "lastModified",
) as HTMLInputElement;

//addEventListener("change", ...) runs when the dropdown value changes.
if (statusSelect && pendingDiv) {
  statusSelect?.addEventListener("change", () => {
    if (statusSelect.value === "Pending") {
      pendingDiv?.classList.remove("hide");
    } else {
      pendingDiv?.classList.add("hide");
    }
  });
}
let editIndex: number | null = null;

//Function for Getting Data .... JSON.parse() expects a string ... converts string to real array:
const getDocDetails = (): DocItem[] => {
  return JSON.parse(localStorage.getItem("docDetails") ?? "[]");
};

//Function for Saving Data
const setDocDetails = (data: DocItem[]): void => {
  localStorage.setItem("docDetails", JSON.stringify(data));
};

type DocItem = {
  name: string;
  status: string;
  waiting?: number;
  lastModified: string;
};

// logout toggle
sidebarAarrow?.addEventListener("click", function (e) {
  e.stopPropagation();
  logOut?.classList.toggle("hide");
});

//Add doc button toggle so form display
navAddDocButt?.addEventListener("click", function () {
  formAddDoc?.classList.toggle("hide");
  if (lastModifiedInput) {
    lastModifiedInput.value = new Date().toLocaleString();
  }
});

//cancel button of form
cancelbtn?.addEventListener("click", () => {
  formAddDoc?.classList.toggle("hide");
  form?.reset();
  editIndex = null;
  if (formHeader && addButton) {
    formHeader.textContent = "Add Document";
    addButton.textContent = "Add";
  }
  pendingDiv?.classList.add("hide");
});

document.addEventListener("click", function (e) {
  const target = e.target as HTMLElement;

  // If click is NOT inside arrow and NOT inside logout menu
  if (!target.closest(".sidebarArrow") && !target.closest(".logOut")) {
    logOut?.classList.remove("show");
  }

  // Close menu when clicking anywhere outside
  // If click is NOT inside .dots AND NOT inside .editDltDiv
  if (!target.closest(".dots") && !target.closest(".editDltDiv")) {
    document.querySelectorAll(".editDltDiv").forEach(function (menu) {
      menu.classList.add("hide");
    });
  }

  // deleting details
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
    row?.remove();
  }

  //5. edit doc (this just show to pick index and store that row data in docname and status var and open form withese value )
  // after form reopen so add in same row functionality done in submit form part
  if (target.classList.contains("edit")) {
    // Get index
    const indexValue = target.dataset.index;
    if (!indexValue) return;

    editIndex = Number(indexValue);

    // Get data
    let details = getDocDetails();

    let item = details[editIndex];

    if (!form || !formHeader || !addButton || !formAddDoc) return;
    // Fill form fields
    form.docname.value = item?.name;
    form.status.value = item?.status;

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

tbody?.addEventListener("click", function (e) {
  // Check if 3 dots clicked
  const target = e.target as HTMLElement;
  let dots = target.closest(".dots");
  //  If dots clicked
  if (dots) {
    let currentRow = dots.closest("tr");
    if (!currentRow) return null;
    let currentMenu = currentRow.querySelector(".editDltDiv");

    // Close all other menus first
    document.querySelectorAll(".editDltDiv").forEach(function (menu) {
      if (menu !== currentMenu) {
        menu.classList.add("hide");
      }
    });

    // Toggle current menu
    currentMenu?.classList.toggle("hide");
  }
});

//6. searchBox functionality

searchInput?.addEventListener("keyup", (e) => {
  const target = e.target as HTMLInputElement;
  const searchValue = target.value.toLowerCase();

  const details = getDocDetails();

  const filteredData = details.filter((item) =>
    item.name.toLowerCase().includes(searchValue),
  );

  displayData(filteredData);
});

//7. submit form row will show functionality
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    let name = target.docname.value;
    let status = target.status.value;
    let waiting = target.num as HTMLInputElement;
    let now = new Date().toLocaleString();
    let details = getDocDetails();
    const newItem: DocItem = {
      name,
      status,
      lastModified: now,
    };
    if (status === "Pending") {
      newItem.waiting = Number(waiting.value);
    }

    if (editIndex !== null) {
      details[editIndex] = newItem;
    } else {
      details.push(newItem);
    }

    setDocDetails(details);
    displayData();
    // reset everything in one place
    form.reset();
    pendingDiv?.classList.add("hide");

    editIndex = null;

    if (formHeader && addButton) {
      formHeader.textContent = "Add Document";
      addButton.textContent = "Add";
    }

    formAddDoc?.classList.add("hide");
  });
}

//Display data {here data for search input box if anything in search so show only that otherwise all}

let displayData = (data?: DocItem[]) => {
  let details: DocItem[] = data ?? getDocDetails();
  let finalData = "";
  details.forEach((element, i) => {
    let status_class = "";
    let signNow_class = "";
    let waitingDiv = "";
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

    finalData += ` <tr class="row">
                            <td class="check">
                                <input type="checkbox">
                            </td>
                            <td class="doc">
                                ${element.name}
                            </td>
                            <td class="StatusDiv">
                                
                                <div><span class="status ${status_class}" >${element.status}</span></div>
                                <div>${
                                  element.status === "Pending" &&
                                  element.waiting
                                    ? `<div class="W1">Waiting for <span class="W2"> ${element.waiting} </span> persons</div>`
                                    : ""
                                }</div>
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
                                    <button class="edit" data-index="${i}"><img src="Assest/Icons/edit.svg"/>Edit</button>
                                    <button class="delete" data-index="${i}"><img src="Assest/Icons/delete.png"/>Delete</button>
                                </div>
                              </div>
                            </td>
                        </tr>`;
  });
  if (tbody) tbody.innerHTML = finalData;
};

displayData();
