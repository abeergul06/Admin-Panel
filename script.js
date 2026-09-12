/* ==========================================
   ADMIN DASHBOARD
   Client-side State Management
========================================== */


/* ==========================================
   STATE
========================================== */

const state = {
    orders: [],
    search: "",
    status: "all",
    category: "all",
    currentPage: 1,
    pageSize: 5,
    editingId: null,
    loading: true,
    error: false
};


/* ==========================================
   DOM ELEMENTS
========================================== */

const elements = {

    sidebar: document.getElementById("sidebar"),
    overlay: document.getElementById("overlay"),
    menuBtn: document.getElementById("menuBtn"),

    pageTitle: document.getElementById("pageTitle"),

    totalUsers: document.getElementById("totalUsers"),
    totalOrders: document.getElementById("totalOrders"),
    pendingOrders: document.getElementById("pendingOrders"),
    totalRevenue: document.getElementById("totalRevenue"),

    searchInput: document.getElementById("searchInput"),
    statusFilter: document.getElementById("statusFilter"),
    categoryFilter: document.getElementById("categoryFilter"),

    tableWrapper: document.getElementById("tableWrapper"),
    tableBody: document.getElementById("ordersTableBody"),

    loadingState: document.getElementById("loadingState"),
    emptyState: document.getElementById("emptyState"),
    errorState: document.getElementById("errorState"),

    pagination: document.getElementById("pagination"),
    paginationInfo: document.getElementById("paginationInfo"),

    addOrderBtn: document.getElementById("addOrderBtn"),

    modal: document.getElementById("orderModal"),
    modalTitle: document.getElementById("modalTitle"),
    closeModal: document.getElementById("closeModal"),
    cancelModal: document.getElementById("cancelModal"),

    orderForm: document.getElementById("orderForm"),
    orderId: document.getElementById("orderId"),
    customerName: document.getElementById("customerName"),
    orderCategory: document.getElementById("orderCategory"),
    orderAmount: document.getElementById("orderAmount"),
    orderStatus: document.getElementById("orderStatus"),

    retryBtn: document.getElementById("retryBtn"),

    clearDataBtn: document.getElementById("clearDataBtn"),

    toast: document.getElementById("toast"),
    toastMessage: document.getElementById("toastMessage")
};


/* ==========================================
   DEFAULT DATA
========================================== */

const defaultOrders = [

    {
        id: 1,
        customer: "Ali Khan",
        category: "Web Development",
        amount: 850,
        status: "Completed",
        date: "2026-09-01"
    },

    {
        id: 2,
        customer: "Sara Ahmed",
        category: "Design",
        amount: 450,
        status: "Pending",
        date: "2026-09-02"
    },

    {
        id: 3,
        customer: "Hamza Malik",
        category: "Marketing",
        amount: 620,
        status: "Completed",
        date: "2026-09-03"
    },

    {
        id: 4,
        customer: "Ayesha Noor",
        category: "Web Development",
        amount: 1200,
        status: "Pending",
        date: "2026-09-04"
    },

    {
        id: 5,
        customer: "Usman Ali",
        category: "Design",
        amount: 350,
        status: "Cancelled",
        date: "2026-09-05"
    },

    {
        id: 6,
        customer: "Fatima Zahra",
        category: "Marketing",
        amount: 720,
        status: "Completed",
        date: "2026-09-06"
    },

    {
        id: 7,
        customer: "Bilal Ahmed",
        category: "Web Development",
        amount: 980,
        status: "Pending",
        date: "2026-09-07"
    },

    {
        id: 8,
        customer: "Hina Shah",
        category: "Design",
        amount: 560,
        status: "Completed",
        date: "2026-09-08"
    },

    {
        id: 9,
        customer: "Zain Raza",
        category: "Marketing",
        amount: 400,
        status: "Pending",
        date: "2026-09-09"
    },

    {
        id: 10,
        customer: "Maham Tariq",
        category: "Web Development",
        amount: 1500,
        status: "Completed",
        date: "2026-09-10"
    },

    {
        id: 11,
        customer: "Ahmed Hassan",
        category: "Design",
        amount: 750,
        status: "Pending",
        date: "2026-09-10"
    }

];


/* ==========================================
   INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadData();

    setupEventListeners();

    simulateLoading();

});


/* ==========================================
   LOAD DATA
========================================== */

function loadData() {

    const savedOrders = localStorage.getItem("adminOrders");

    if (savedOrders) {

        try {

            state.orders = JSON.parse(savedOrders);

        } catch (error) {

            state.orders = [...defaultOrders];

        }

    } else {

        state.orders = [...defaultOrders];

    }

}


/* ==========================================
   SAVE DATA
========================================== */

function saveData() {

    localStorage.setItem(
        "adminOrders",
        JSON.stringify(state.orders)
    );

}


/* ==========================================
   LOADING SIMULATION
========================================== */

function simulateLoading() {

    state.loading = true;

    updateView();

    setTimeout(() => {

        state.loading = false;

        state.error = false;

        updateView();

    }, 900);

}


/* ==========================================
   UPDATE VIEW
========================================== */

function updateView() {

    updateStatistics();

    updateStates();

    renderOrders();

}


/* ==========================================
   STATISTICS
========================================== */

function updateStatistics() {

    const totalOrders = state.orders.length;

    const pending = state.orders.filter(
        order => order.status === "Pending"
    ).length;

    const revenue = state.orders
        .filter(order => order.status !== "Cancelled")
        .reduce(
            (total, order) => total + Number(order.amount),
            0
        );

    elements.totalUsers.textContent =
        new Set(state.orders.map(order => order.customer)).size;

    elements.totalOrders.textContent =
        totalOrders;

    elements.pendingOrders.textContent =
        pending;

    elements.totalRevenue.textContent =
        `$${revenue.toLocaleString()}`;

}


/* ==========================================
   FILTER ORDERS
========================================== */

function getFilteredOrders() {

    return state.orders.filter(order => {

        const searchMatch =
            order.customer
                .toLowerCase()
                .includes(state.search.toLowerCase()) ||

            order.category
                .toLowerCase()
                .includes(state.search.toLowerCase());

        const statusMatch =
            state.status === "all" ||
            order.status === state.status;

        const categoryMatch =
            state.category === "all" ||
            order.category === state.category;

        return (
            searchMatch &&
            statusMatch &&
            categoryMatch
        );

    });

}


/* ==========================================
   RENDER ORDERS
========================================== */

function renderOrders() {

    if (state.loading || state.error) {
        return;
    }

    const filteredOrders = getFilteredOrders();

    const totalPages =
        Math.ceil(
            filteredOrders.length /
            state.pageSize
        );

    if (
        state.currentPage > totalPages &&
        totalPages > 0
    ) {
        state.currentPage = totalPages;
    }

    const start =
        (state.currentPage - 1) *
        state.pageSize;

    const end =
        start + state.pageSize;

    const pageOrders =
        filteredOrders.slice(start, end);


    elements.tableBody.innerHTML = "";


    pageOrders.forEach(order => {

        const row =
            document.createElement("tr");

        const statusClass =
            order.status.toLowerCase();


        row.innerHTML = `

            <td>
                <span class="customer">
                    ${escapeHTML(order.customer)}
                </span>
            </td>

            <td>
                ${escapeHTML(order.category)}
            </td>

            <td>
                $${Number(order.amount).toLocaleString()}
            </td>

            <td>
                <span class="badge ${statusClass}">
                    ${order.status}
                </span>
            </td>

            <td>
                ${formatDate(order.date)}
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn edit-btn"
                        onclick="editOrder(${order.id})"
                        title="Edit"
                    >
                        ✏️
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteOrder(${order.id})"
                        title="Delete"
                    >
                        🗑️
                    </button>

                </div>

            </td>
        `;


        elements.tableBody.appendChild(row);

    });


    renderPagination(
        filteredOrders.length,
        totalPages
    );

}


/* ==========================================
   UPDATE STATES
========================================== */

function updateStates() {

    elements.loadingState.classList.toggle(
        "hidden",
        !state.loading
    );

    elements.errorState.classList.toggle(
        "hidden",
        !state.error
    );


    const filteredOrders =
        getFilteredOrders();

    const showEmpty =
        !state.loading &&
        !state.error &&
        filteredOrders.length === 0;


    elements.emptyState.classList.toggle(
        "hidden",
        !showEmpty
    );


    elements.tableWrapper.classList.toggle(
        "hidden",
        state.loading ||
        state.error ||
        showEmpty
    );


    elements.pagination.classList.toggle(
        "hidden",
        state.loading ||
        state.error ||
        showEmpty
    );

}


/* ==========================================
   PAGINATION
========================================== */

function renderPagination(
    totalItems,
    totalPages
) {

    elements.pagination.innerHTML = "";


    if (totalItems === 0) {

        elements.paginationInfo.textContent =
            "Showing 0 results";

        return;

    }


    const start =
        ((state.currentPage - 1) *
            state.pageSize) + 1;

    const end =
        Math.min(
            start + state.pageSize - 1,
            totalItems
        );


    elements.paginationInfo.textContent =
        `Showing ${start}-${end} of ${totalItems}`;


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement("button");

        button.className = "page-btn";

        if (
            page === state.currentPage
        ) {
            button.classList.add("active");
        }

        button.textContent = page;

        button.addEventListener(
            "click",
            () => {

                state.currentPage = page;

                updateView();

            }
        );

        elements.pagination.appendChild(button);

    }

}


/* ==========================================
   ADD ORDER
========================================== */

function openAddModal() {

    state.editingId = null;

    elements.modalTitle.textContent =
        "Add Order";

    elements.orderForm.reset();

    elements.orderId.value = "";

    elements.modal.classList.add("show");

    elements.customerName.focus();

}


/* ==========================================
   EDIT ORDER
========================================== */

function editOrder(id) {

    const order =
        state.orders.find(
            order => order.id === id
        );

    if (!order) return;


    state.editingId = id;

    elements.modalTitle.textContent =
        "Edit Order";

    elements.customerName.value =
        order.customer;

    elements.orderCategory.value =
        order.category;

    elements.orderAmount.value =
        order.amount;

    elements.orderStatus.value =
        order.status;

    elements.orderId.value =
        order.id;

    elements.modal.classList.add("show");

}


/* ==========================================
   DELETE ORDER
========================================== */

function deleteOrder(id) {

    const order =
        state.orders.find(
            item => item.id === id
        );

    if (!order) return;


    const confirmed =
        confirm(
            `Delete order for ${order.customer}?`
        );

    if (!confirmed) return;


    state.orders =
        state.orders.filter(
            item => item.id !== id
        );


    saveData();

    showToast("Order deleted successfully.");

    updateView();

}


/* ==========================================
   CLOSE MODAL
========================================== */

function closeModal() {

    elements.modal.classList.remove("show");

    elements.orderForm.reset();

    state.editingId = null;

}


/* ==========================================
   FORM SUBMISSION
========================================== */

function handleFormSubmit(event) {

    event.preventDefault();


    const customer =
        elements.customerName.value.trim();

    const category =
        elements.orderCategory.value;

    const amount =
        Number(elements.orderAmount.value);

    const status =
        elements.orderStatus.value;


    if (!customer) {

        showToast("Please enter customer name.");

        elements.customerName.focus();

        return;

    }


    if (!category) {

        showToast("Please select a category.");

        return;

    }


    if (!amount || amount <= 0) {

        showToast("Please enter a valid amount.");

        return;

    }


    /* EDIT */

    if (state.editingId) {

        const index =
            state.orders.findIndex(
                order =>
                    order.id ===
                    state.editingId
            );


        if (index !== -1) {

            state.orders[index] = {

                ...state.orders[index],

                customer,
                category,
                amount,
                status

            };

        }


        showToast(
            "Order updated successfully."
        );

    }

    /* ADD */

    else {

        const newOrder = {

            id: Date.now(),

            customer,

            category,

            amount,

            status,

            date:
                new Date()
                    .toISOString()
                    .split("T")[0]

        };


        state.orders.unshift(
            newOrder
        );


        showToast(
            "Order added successfully."
        );

    }


    saveData();

    closeModal();

    state.currentPage = 1;

    updateView();

}


/* ==========================================
   NAVIGATION
========================================== */

function changeSection(section) {

    const sections =
        document.querySelectorAll(
            ".page-section"
        );


    sections.forEach(item => {

        item.classList.add(
            "hidden-section"
        );

    });


    const target =
        document.getElementById(
            `${section}Section`
        );


    if (target) {

        target.classList.remove(
            "hidden-section"
        );

    }


    elements.pageTitle.textContent =
        section.charAt(0).toUpperCase() +
        section.slice(1);


    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.section === section
            );

        });


    closeSidebar();

}


/* ==========================================
   SIDEBAR MOBILE
========================================== */

function openSidebar() {

    elements.sidebar.classList.add(
        "open"
    );

    elements.overlay.classList.add(
        "show"
    );

}


function closeSidebar() {

    elements.sidebar.classList.remove(
        "open"
    );

    elements.overlay.classList.remove(
        "show"
    );

}


/* ==========================================
   TOAST
========================================== */

function showToast(message) {

    elements.toastMessage.textContent =
        message;

    elements.toast.classList.add(
        "show"
    );


    setTimeout(() => {

        elements.toast.classList.remove(
            "show"
        );

    }, 2500);

}


/* ==========================================
   FORMAT DATE
========================================== */

function formatDate(date) {

    return new Date(date)
        .toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

}


/* ==========================================
   SECURITY HELPER
========================================== */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* ==========================================
   RESET DEMO DATA
========================================== */

function resetData() {

    const confirmed =
        confirm(
            "Reset all orders to the original demo data?"
        );

    if (!confirmed) return;


    state.orders =
        [...defaultOrders];

    state.currentPage = 1;

    state.search = "";

    state.status = "all";

    state.category = "all";


    elements.searchInput.value = "";

    elements.statusFilter.value = "all";

    elements.categoryFilter.value = "all";


    saveData();

    updateView();

    showToast(
        "Demo data has been reset."
    );

}


/* ==========================================
   EVENT LISTENERS
========================================== */

function setupEventListeners() {


    /* Search */

    elements.searchInput.addEventListener(
        "input",
        event => {

            state.search =
                event.target.value;

            state.currentPage = 1;

            updateView();

        }
    );


    /* Status Filter */

    elements.statusFilter.addEventListener(
        "change",
        event => {

            state.status =
                event.target.value;

            state.currentPage = 1;

            updateView();

        }
    );


    /* Category Filter */

    elements.categoryFilter.addEventListener(
        "change",
        event => {

            state.category =
                event.target.value;

            state.currentPage = 1;

            updateView();

        }
    );


    /* Add */

    elements.addOrderBtn.addEventListener(
        "click",
        openAddModal
    );


    /* Form */

    elements.orderForm.addEventListener(
        "submit",
        handleFormSubmit
    );


    /* Modal close */

    elements.closeModal.addEventListener(
        "click",
        closeModal
    );


    elements.cancelModal.addEventListener(
        "click",
        closeModal
    );


    /* Outside modal */

    elements.modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                elements.modal
            ) {
                closeModal();
            }

        }
    );


    /* Retry */

    elements.retryBtn.addEventListener(
        "click",
        () => {

            state.error = false;

            simulateLoading();

        }
    );


    /* Reset */

    elements.clearDataBtn.addEventListener(
        "click",
        resetData
    );


    /* Mobile menu */

    elements.menuBtn.addEventListener(
        "click",
        openSidebar
    );


    elements.overlay.addEventListener(
        "click",
        closeSidebar
    );


    /* Navigation */

    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    changeSection(
                        link.dataset.section
                    );

                }
            );

        });

}


/* ==========================================
   KEYBOARD ACCESSIBILITY
========================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

            closeSidebar();

        }

    }
);