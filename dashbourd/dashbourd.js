document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sidebar = document.querySelector(".sidebar");
    const menuIcon = document.querySelector(".menu-icon");
    const dashboardContainer = document.querySelector(".dashboard-container");
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const body = document.body;

    // Elements specific to incidents.html
    const addNewIncidentBtn = document.getElementById("addNewIncidentBtn");
    const incidentFormContainer = document.getElementById("incidentFormContainer");
    const incidentForm = document.getElementById("incidentForm");
    const cancelFormBtn = document.getElementById("cancelFormBtn");
    const incidentsTableBody = document.getElementById("incidentsTableBody");
    const incidentIdInput = document.getElementById("incidentId");
    const incidentNameInput = document.getElementById("incidentName");
    const incidentDescriptionInput = document.getElementById("incidentDescription");
    const incidentImageInput = document.getElementById("incidentImage");
    const imagePreview = document.getElementById("imagePreview");
    const incidentLocationInput = document.getElementById("incidentLocation");
    const incidentCategoryInput = document.getElementById("incidentCategory");
    const incidentPriorityInput = document.getElementById("incidentPriority");
    const incidentStatusInput = document.getElementById("incidentStatus");
    const searchInput = document.getElementById("searchInput");
    const filterCategory = document.getElementById("filterCategory");
    const filterPriority = document.getElementById("filterPriority");
    const filterStatus = document.getElementById("filterStatus");
    const filterDate = document.getElementById("filterDate");
    const exportCsvBtn = document.getElementById("exportCsvBtn");
    const exportPdfBtn = document.getElementById("exportPdfBtn");
    const notificationPopup = document.getElementById("notification-popup");
    const notificationMessage = document.getElementById("notification-message");

    // Elements specific to dashboard.html
    const totalIncidentsCard = document.getElementById("totalIncidents");
    const pendingIncidentsCard = document.getElementById("pendingIncidents");
    const resolvedIncidentsCard = document.getElementById("resolvedIncidents");
    const highPriorityCard = document.getElementById("highPriority");

    // Global Variables
    let incidents = [];
    let isEditMode = false;

    // --- Helper Functions ---
    function saveIncidentsToLocalStorage() {
        localStorage.setItem("incidents", JSON.stringify(incidents));
    }

    function loadIncidentsFromLocalStorage() {
        const storedIncidents = localStorage.getItem("incidents");
        incidents = storedIncidents ? JSON.parse(storedIncidents) : [];
    }

    function generateUniqueId() {
        return Date.now().toString();
    }

    function showIncidentForm() {
        if (incidentFormContainer) {
            incidentFormContainer.style.display = "block";
            incidentFormContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function hideIncidentForm() {
        if (incidentFormContainer) {
            incidentFormContainer.style.display = "none";
            incidentForm.reset();
            incidentIdInput.value = "";
            imagePreview.src = "";
            imagePreview.style.display = "none";
            isEditMode = false;
        }
    }

    function updateDashboardCards() {
        if (totalIncidentsCard) {
            totalIncidentsCard.textContent = incidents.length;
            pendingIncidentsCard.textContent = incidents.filter(i => i.status === 'Pending').length;
            resolvedIncidentsCard.textContent = incidents.filter(i => i.status === 'Resolved').length;
            highPriorityCard.textContent = incidents.filter(i => i.priority === 'High').length;
        }
    }

    function toggleTheme() {
        body.classList.toggle("dark-mode");
        const isDarkMode = body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        themeToggleBtn.innerHTML = isDarkMode
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem("theme");
        body.classList.toggle("dark-mode", savedTheme === "dark");
        themeToggleBtn.innerHTML =
            savedTheme === "dark"
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
    }

    function showNotification(message, type = 'success') {
        notificationMessage.textContent = message;
        notificationPopup.classList.remove('success', 'error');
        notificationPopup.classList.add(type);
        notificationPopup.style.display = 'block';
        setTimeout(() => {
            notificationPopup.style.display = 'none';
        }, 3000);
    }
    
    function renderIncidents(filteredArray = incidents) {
        if (!incidentsTableBody) return;

        incidentsTableBody.innerHTML = "";
        if (filteredArray.length === 0) {
            incidentsTableBody.innerHTML =
                '<tr><td colspan="7" style="text-align: center;">No incidents found. Add a new one!</td></tr>';
            return;
        }

        filteredArray.forEach((incident) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td data-label="Image"><img src="${incident.image || 'https://via.placeholder.com/50'}" alt="Incident Image"></td>
                <td data-label="Name">${incident.name || "N/A"}</td>
                <td data-label="Category">${incident.category || "N/A"}</td>
                <td data-label="Priority">${incident.priority || "N/A"}</td>
                <td data-label="Status">${incident.status || "N/A"}</td>
                <td data-label="Date">${new Date(incident.timestamp).toLocaleString()}</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${incident.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${incident.id}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            incidentsTableBody.appendChild(row);
        });
        addTableButtonListeners();
    }
    
    function addTableButtonListeners() {
        if (!incidentsTableBody) return;
        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.onclick = (event) => deleteIncident(event.currentTarget.dataset.id);
        });
        document.querySelectorAll(".edit-btn").forEach((button) => {
            button.onclick = (event) => editIncident(event.currentTarget.dataset.id);
        });
    }

    function deleteIncident(id) {
        if (confirm("Are you sure you want to delete this incident?")) {
            incidents = incidents.filter((incident) => incident.id !== id);
            saveIncidentsToLocalStorage();
            renderIncidents();
            updateDashboardCards();
            showNotification("Incident deleted successfully.", "error");
        }
    }

    function editIncident(id) {
        isEditMode = true;
        const incidentToEdit = incidents.find((incident) => incident.id === id);
        if (incidentToEdit) {
            incidentIdInput.value = incidentToEdit.id;
            incidentNameInput.value = incidentToEdit.name;
            incidentDescriptionInput.value = incidentToEdit.description;
            incidentLocationInput.value = incidentToEdit.location;
            incidentCategoryInput.value = incidentToEdit.category;
            incidentPriorityInput.value = incidentToEdit.priority;
            incidentStatusInput.value = incidentToEdit.status;
            if (incidentToEdit.image) {
                imagePreview.src = incidentToEdit.image;
                imagePreview.style.display = "block";
            } else {
                imagePreview.src = "";
                imagePreview.style.display = "none";
            }
            showIncidentForm();
        }
    }

    // --- Event Listeners ---
    if (menuIcon) {
        menuIcon.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                // Ku dar oo ka saar show-menu class sidebar-ka
                sidebar.classList.toggle("show-menu");
                // Ku dar oo ka saar sidebar-open class dashboard-container-ka
                dashboardContainer.classList.toggle("sidebar-open");
            } else {
                sidebar.classList.toggle("collapsed");
            }
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", toggleTheme);
    }
    
    // ... [Halka u hadda ayuu isku mid yahay code-kaaga] ...
    if (incidentsTableBody) {
        addNewIncidentBtn.addEventListener("click", () => {
            isEditMode = false;
            hideIncidentForm();
            showIncidentForm();
        });

        cancelFormBtn.addEventListener("click", hideIncidentForm);

        incidentImageInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = "block";
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.src = "";
                imagePreview.style.display = "none";
            }
        });

        searchInput.addEventListener("input", filterAndSearch);
        filterCategory.addEventListener("change", filterAndSearch);
        filterPriority.addEventListener("change", filterAndSearch);
        filterStatus.addEventListener("change", filterAndSearch);
        filterDate.addEventListener("change", filterAndSearch);
        
        exportCsvBtn.addEventListener('click', () => {
            const csv = Papa.unparse(incidents.map(({ id, name, description, location, category, priority, status, timestamp }) => ({ id, name, description, location, category, priority, status, timestamp })));
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'incidents.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        exportPdfBtn.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            const tableColumn = ["ID", "Name", "Category", "Priority", "Status", "Date"];
            const tableRows = incidents.map(inc => [
                inc.id,
                inc.name,
                inc.category,
                inc.priority,
                inc.status,
                new Date(inc.timestamp).toLocaleDateString()
            ]);

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                styles: { fontSize: 8 }
            });

            doc.save('incidents.pdf');
        });

        incidentForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const id = incidentIdInput.value;
            const name = incidentNameInput.value.trim();
            const description = incidentDescriptionInput.value.trim();
            const location = incidentLocationInput.value.trim();
            const category = incidentCategoryInput.value;
            const priority = incidentPriorityInput.value;
            const status = incidentStatusInput.value;
            const timestamp = new Date().toISOString();

            const newIncident = {
                id: id || generateUniqueId(),
                name,
                description,
                image: '',
                location,
                category,
                priority,
                status,
                timestamp,
            };

            const file = incidentImageInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = function () {
                    newIncident.image = reader.result;
                    saveAndRender(newIncident);
                };
                reader.readAsDataURL(file);
            } else {
                if (isEditMode) {
                    const currentIncident = incidents.find(i => i.id === id);
                    if (currentIncident) newIncident.image = currentIncident.image;
                }
                saveAndRender(newIncident);
            }
        });

        function saveAndRender(newIncident) {
            if (isEditMode) {
                const index = incidents.findIndex((incident) => incident.id === newIncident.id);
                if (index !== -1) {
                    incidents[index] = newIncident;
                    showNotification("Incident updated successfully! ✨");
                }
            } else {
                incidents.push(newIncident);
                showNotification("Incident logged successfully! 🎉");
                if (newIncident.priority === 'High') {
                    setTimeout(() => showNotification("High-priority incident logged!", 'error'), 3500);
                }
            }

            saveIncidentsToLocalStorage();
            renderIncidents();
            hideIncidentForm();
        }

        function filterAndSearch() {
            const query = searchInput.value.toLowerCase();
            const category = filterCategory.value;
            const priority = filterPriority.value;
            const status = filterStatus.value;
            const date = filterDate.value;

            const filteredIncidents = incidents.filter(incident => {
                const matchesSearch = incident.name.toLowerCase().includes(query) || incident.description.toLowerCase().includes(query);
                const matchesCategory = !category || incident.category === category;
                const matchesPriority = !priority || incident.priority === priority;
                const matchesStatus = !status || incident.status === status;
                const matchesDate = !date || incident.timestamp.startsWith(date);
                return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesDate;
            });

            renderIncidents(filteredIncidents);
        }
    }

    // Initial load
    loadTheme();
    loadIncidentsFromLocalStorage();
    renderIncidents();
    updateDashboardCards();
});
const user = localStorage.getItem("currentUser");
if (user) {
  document.getElementById("username").textContent = user;
} else {
  // Haddii user la'aan uu yimaado, dib u dir
  window.location.href = "./login.html";
}
//   // Hel link-ga Logout
//   const logoutLink = document.querySelector('a i.fas.fa-sign-out-alt').parentElement;

//   logoutLink.addEventListener('click', function(e) {
//     e.preventDefault();
//     // tir xogta user-ka
//     localStorage.removeItem('currentUser');
//     // redirect login
//     window.location.href = "./login.html";
//   });