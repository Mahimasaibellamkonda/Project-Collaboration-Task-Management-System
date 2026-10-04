/* ==========================================
   PROJECTFLOW
   Project Collaboration & Task Management
========================================== */


/* ---------- INITIAL DATA ---------- */

let projects = JSON.parse(localStorage.getItem("projectflow_projects")) || [
    {
        id: 1,
        name: "Campus Management System",
        description: "Centralized platform for managing campus services.",
        deadline: "2026-10-25",
        status: "active"
    },
    {
        id: 2,
        name: "E-Commerce Platform",
        description: "Modern online shopping platform with product management.",
        deadline: "2026-11-08",
        status: "active"
    },
    {
        id: 3,
        name: "AI Research Portal",
        description: "Research collaboration platform for AI projects.",
        deadline: "2026-09-30",
        status: "completed"
    }
];


let tasks = JSON.parse(localStorage.getItem("projectflow_tasks")) || [
    {
        id: 1,
        name: "Design login page",
        projectId: 1,
        assignee: "Mahima",
        priority: "high",
        status: "completed",
        due: "2026-10-05"
    },
    {
        id: 2,
        name: "Create database schema",
        projectId: 1,
        assignee: "Rahul",
        priority: "high",
        status: "progress",
        due: "2026-10-08"
    },
    {
        id: 3,
        name: "Build dashboard interface",
        projectId: 2,
        assignee: "Anjali",
        priority: "medium",
        status: "progress",
        due: "2026-10-12"
    },
    {
        id: 4,
        name: "Prepare project documentation",
        projectId: 3,
        assignee: "Mahima",
        priority: "low",
        status: "completed",
        due: "2026-09-28"
    }
];


let team = JSON.parse(localStorage.getItem("projectflow_team")) || [
    {
        id: 1,
        name: "Mahima",
        email: "mahima@example.com",
        role: "Project Administrator"
    },
    {
        id: 2,
        name: "Rahul Kumar",
        email: "rahul@example.com",
        role: "Backend Developer"
    },
    {
        id: 3,
        name: "Anjali Sharma",
        email: "anjali@example.com",
        role: "UI/UX Designer"
    },
    {
        id: 4,
        name: "Arun Raj",
        email: "arun@example.com",
        role: "Frontend Developer"
    }
];


/* ---------- SAVE DATA ---------- */

function saveData() {
    localStorage.setItem(
        "projectflow_projects",
        JSON.stringify(projects)
    );

    localStorage.setItem(
        "projectflow_tasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "projectflow_team",
        JSON.stringify(team)
    );
}


/* ---------- NAVIGATION ---------- */

const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".content-section");
const pageTitle = document.getElementById("pageTitle");


function showSection(sectionName) {

    sections.forEach(section => {
        section.classList.remove("active-section");
    });

    const target = document.getElementById(sectionName);

    if (target) {
        target.classList.add("active-section");
    }

    navItems.forEach(item => {
        item.classList.remove("active");

        if (item.dataset.section === sectionName) {
            item.classList.add("active");
        }
    });

    const titles = {
        dashboard: "Dashboard",
        projects: "Projects",
        tasks: "Tasks",
        team: "Team"
    };

    pageTitle.textContent = titles[sectionName] || "Dashboard";
}


navItems.forEach(item => {

    item.addEventListener("click", () => {
        showSection(item.dataset.section);
    });

});


document.querySelectorAll("[data-section-target]").forEach(button => {

    button.addEventListener("click", () => {
        showSection(button.dataset.sectionTarget);
    });

});


/* ---------- DATE ---------- */

function setCurrentDate() {

    const date = new Date();

    const formatted = date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    document.getElementById("currentDate").textContent = formatted;
}


/* ---------- PROJECT RENDERING ---------- */

function renderProjects(filter = "all") {

    const container = document.getElementById("projectsGrid");

    let filteredProjects = projects;

    if (filter === "active") {
        filteredProjects = projects.filter(
            project => project.status === "active"
        );
    }

    if (filter === "completed") {
        filteredProjects = projects.filter(
            project => project.status === "completed"
        );
    }

    if (filteredProjects.length === 0) {

        container.innerHTML = `
            <div class="panel" style="padding:30px; grid-column:1/-1;">
                <p style="color:#6b7280;font-size:13px;">
                    No projects found.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML = filteredProjects.map(project => {

        const projectTasks = tasks.filter(
            task => task.projectId === project.id
        );

        const completed = projectTasks.filter(
            task => task.status === "completed"
        ).length;

        const progress = projectTasks.length
            ? Math.round((completed / projectTasks.length) * 100)
            : 0;

        return `
            <div class="project-card">

                <div class="project-card-header">
                    <div class="project-symbol">
                        ${project.name.charAt(0).toUpperCase()}
                    </div>

                    <button class="menu-btn"
                        onclick="deleteProject(${project.id})">
                        ⋮
                    </button>
                </div>

                <h3>${project.name}</h3>

                <p>${project.description}</p>

                <div class="card-meta">
                    <span>Progress</span>
                    <strong>${progress}%</strong>
                </div>

                <div class="progress-track">
                    <div class="progress-bar"
                         style="width:${progress}%"></div>
                </div>

                <div class="card-footer">

                    <div class="member-stack">

                        ${team.slice(0, 3).map(member => `
                            <div class="member-mini"
                                 title="${member.name}">
                                ${member.name.charAt(0).toUpperCase()}
                            </div>
                        `).join("")}

                    </div>

                    <span style="font-size:10px;color:#6b7280;">
                        Due ${formatDate(project.deadline)}
                    </span>

                </div>

            </div>
        `;

    }).join("");
}


/* ---------- DASHBOARD PROJECTS ---------- */

function renderDashboardProjects() {

    const container = document.getElementById("dashboardProjects");

    const active = projects.filter(
        project => project.status === "active"
    ).slice(0, 4);


    if (active.length === 0) {
        container.innerHTML = `
            <div style="padding:20px 0;color:#6b7280;font-size:12px;">
                No active projects.
            </div>
        `;
        return;
    }


    container.innerHTML = active.map(project => {

        const projectTasks = tasks.filter(
            task => task.projectId === project.id
        );

        const completed = projectTasks.filter(
            task => task.status === "completed"
        ).length;

        const progress = projectTasks.length
            ? Math.round((completed / projectTasks.length) * 100)
            : 0;


        return `
            <div class="project-row">

                <div class="project-row-top">
                    <strong>${project.name}</strong>
                    <span>${progress}%</span>
                </div>

                <div class="progress-track">
                    <div class="progress-bar"
                         style="width:${progress}%"></div>
                </div>

            </div>
        `;

    }).join("");
}


/* ---------- DASHBOARD TASKS ---------- */

function renderDashboardTasks() {

    const container = document.getElementById("dashboardTasks");

    const latestTasks = tasks.slice(0, 5);

    if (latestTasks.length === 0) {

        container.innerHTML = `
            <div style="padding:20px;color:#6b7280;font-size:12px;">
                No tasks available.
            </div>
        `;

        return;
    }


    container.innerHTML = latestTasks.map(task => {

        return `
            <div class="mini-task">

                <div class="check ${task.status === "completed" ? "done" : ""}">
                </div>

                <div>
                    <strong>${task.name}</strong>
                    <small>
                        ${getProjectName(task.projectId)}
                    </small>
                </div>

            </div>
        `;

    }).join("");
}


/* ---------- TASKS ---------- */

function renderTasks() {

    const container = document.getElementById("tasksList");

    const searchValue =
        document.getElementById("taskSearch").value.toLowerCase();

    const statusValue =
        document.getElementById("statusFilter").value;

    const priorityValue =
        document.getElementById("priorityFilter").value;


    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.name.toLowerCase().includes(searchValue) ||
            getProjectName(task.projectId)
                .toLowerCase()
                .includes(searchValue);

        const matchesStatus =
            statusValue === "all" ||
            task.status === statusValue;

        const matchesPriority =
            priorityValue === "all" ||
            task.priority === priorityValue;

        return matchesSearch && matchesStatus && matchesPriority;
    });


    if (filteredTasks.length === 0) {

        container.innerHTML = `
            <div style="padding:30px;text-align:center;color:#6b7280;font-size:12px;">
                No matching tasks found.
            </div>
        `;

        return;
    }


    container.innerHTML = filteredTasks.map(task => {

        return `
            <div class="task-row">

                <div class="task-name">

                    <button
                        class="check ${task.status === "completed" ? "done" : ""}"
                        onclick="toggleTask(${task.id})">
                    </button>

                    <strong>${task.name}</strong>

                </div>

                <span class="project-name">
                    ${getProjectName(task.projectId)}
                </span>

                <span>
                    ${task.assignee}
                </span>

                <span class="priority ${task.priority}">
                    ${capitalize(task.priority)}
                </span>

                <span class="status ${task.status}">
                    ${getStatusName(task.status)}
                </span>

                <span>
                    ${formatDate(task.due)}
                </span>

                <button
                    class="delete-task"
                    onclick="deleteTask(${task.id})">
                    ×
                </button>

            </div>
        `;

    }).join("");
}


/* ---------- TEAM ---------- */

function renderTeam() {

    const container = document.getElementById("teamGrid");

    container.innerHTML = team.map(member => {

        return `
            <div class="team-card">

                <div class="team-avatar">
                    ${member.name.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h3>${member.name}</h3>
                    <p>${member.role}</p>
                    <small>${member.email}</small>
                </div>

            </div>
        `;

    }).join("");
}


/* ---------- HELPERS ---------- */

function getProjectName(id) {

    const project = projects.find(
        project => project.id === id
    );

    return project ? project.name : "Unknown Project";
}


function formatDate(dateString) {

    if (!dateString) return "-";

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


function capitalize(value) {

    return value.charAt(0).toUpperCase() + value.slice(1);
}


function getStatusName(status) {

    const names = {
        todo: "To Do",
        progress: "In Progress",
        completed: "Completed"
    };

    return names[status] || status;
}


/* ---------- DASHBOARD STATS ---------- */

function updateStats() {

    const activeProjects = projects.filter(
        project => project.status === "active"
    ).length;

    const completedTasks = tasks.filter(
        task => task.status === "completed"
    ).length;


    const today = new Date();

    const nextSevenDays = new Date();

    nextSevenDays.setDate(today.getDate() + 7);


    const dueSoon = tasks.filter(task => {

        if (task.status === "completed") {
            return false;
        }

        const dueDate = new Date(task.due + "T00:00:00");

        return dueDate >= today && dueDate <= nextSevenDays;

    }).length;


    document.getElementById("activeProjects").textContent =
        activeProjects;

    document.getElementById("totalTasks").textContent =
        tasks.length;

    document.getElementById("completedTasks").textContent =
        completedTasks;

    document.getElementById("dueSoon").textContent =
        dueSoon;
}


/* ---------- PROJECT MODAL ---------- */

const projectModal = document.getElementById("projectModal");

function openProjectModal() {
    projectModal.classList.add("show");
}

function closeProjectModal() {
    projectModal.classList.remove("show");
}


document.getElementById("newProjectBtn")
    .addEventListener("click", openProjectModal);

document.getElementById("newProjectBtn2")
    .addEventListener("click", openProjectModal);


document.querySelectorAll("[data-close]").forEach(button => {

    button.addEventListener("click", () => {

        const modalId = button.dataset.close;

        document.getElementById(modalId)
            .classList.remove("show");

    });

});


document.getElementById("projectForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const newProject = {

            id: Date.now(),

            name:
                document.getElementById("projectName").value.trim(),

            description:
                document.getElementById("projectDescription").value.trim(),

            deadline:
                document.getElementById("projectDeadline").value,

            status: "active"
        };


        projects.push(newProject);

        saveData();

        this.reset();

        closeProjectModal();

        refreshAll();

        showSection("projects");
    });


/* ---------- TASK MODAL ---------- */

const taskModal = document.getElementById("taskModal");


document.getElementById("newTaskBtn")
    .addEventListener("click", () => {

        populateTaskDropdowns();

        taskModal.classList.add("show");
    });


function populateTaskDropdowns() {

    const projectSelect =
        document.getElementById("taskProject");

    const assigneeSelect =
        document.getElementById("taskAssignee");


    projectSelect.innerHTML = projects.map(project => `
        <option value="${project.id}">
            ${project.name}
        </option>
    `).join("");


    assigneeSelect.innerHTML = team.map(member => `
        <option value="${member.name}">
            ${member.name}
        </option>
    `).join("");
}


document.getElementById("taskForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const newTask = {

            id: Date.now(),

            name:
                document.getElementById("taskName").value.trim(),

            projectId:
                Number(document.getElementById("taskProject").value),

            assignee:
                document.getElementById("taskAssignee").value,

            priority:
                document.getElementById("taskPriority").value,

            status: "todo",

            due:
                document.getElementById("taskDeadline").value
        };


        tasks.push(newTask);

        saveData();

        this.reset();

        taskModal.classList.remove("show");

        refreshAll();

        showSection("tasks");

    });


/* ---------- TEAM MODAL ---------- */

const memberModal =
    document.getElementById("memberModal");


document.getElementById("addMemberBtn")
    .addEventListener("click", () => {

        memberModal.classList.add("show");

    });


document.getElementById("memberForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document.getElementById("memberName").value.trim();

        const email =
            document.getElementById("memberEmail").value.trim();

        const role =
            document.getElementById("memberRole").value.trim();


        team.push({

            id: Date.now(),

            name,

            email,

            role

        });


        saveData();

        this.reset();

        memberModal.classList.remove("show");

        refreshAll();

    });


/* ---------- TASK ACTIONS ---------- */

function toggleTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) return;


    if (task.status === "completed") {
        task.status = "todo";
    } else {
        task.status = "completed";
    }


    saveData();

    refreshAll();
}


function deleteTask(id) {

    const confirmed =
        confirm("Are you sure you want to delete this task?");

    if (!confirmed) return;


    tasks = tasks.filter(
        task => task.id !== id
    );

    saveData();

    refreshAll();
}


function deleteProject(id) {

    const confirmed =
        confirm(
            "Delete this project? Related tasks will also be removed."
        );

    if (!confirmed) return;


    projects = projects.filter(
        project => project.id !== id
    );


    tasks = tasks.filter(
        task => task.projectId !== id
    );


    saveData();

    refreshAll();
}


/* ---------- PROJECT FILTER ---------- */

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".filter")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        renderProjects(button.dataset.filter);

    });

});


/* ---------- TASK FILTERS ---------- */

document.getElementById("taskSearch")
    .addEventListener("input", renderTasks);

document.getElementById("statusFilter")
    .addEventListener("change", renderTasks);

document.getElementById("priorityFilter")
    .addEventListener("change", renderTasks);


/* ---------- GLOBAL SEARCH ---------- */

document.getElementById("globalSearch")
    .addEventListener("input", function() {

        const value = this.value.toLowerCase();

        if (!value) return;

        const projectMatch = projects.some(
            project =>
                project.name.toLowerCase().includes(value)
        );

        const taskMatch = tasks.some(
            task =>
                task.name.toLowerCase().includes(value)
        );


        if (projectMatch) {
            showSection("projects");
        } else if (taskMatch) {
            showSection("tasks");
        }

    });


/* ---------- REFRESH ---------- */

function refreshAll() {

    updateStats();

    renderProjects();

    renderDashboardProjects();

    renderDashboardTasks();

    renderTasks();

    renderTeam();

}


/* ---------- INITIAL LOAD ---------- */

setCurrentDate();

refreshAll();
