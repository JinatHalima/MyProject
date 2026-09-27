// Backend API URL
const API_URL = "http://localhost:5000/api/attendance";


// ========================================
// Load Attendance Records
// ========================================

async function loadAttendance() {

    const tableBody = document.getElementById("attendanceTableBody");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load attendance records");
        }

        const data = await response.json();

        tableBody.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No attendance records found.
                    </td>
                </tr>
            `;

            return;
        }

        data.forEach(attendance => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${attendance.id}</td>

                <td>${attendance.studentName}</td>

                <td>${attendance.studentId}</td>

                <td>${attendance.course}</td>

                <td>${formatDate(attendance.date)}</td>

                <td>${attendance.status}</td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editAttendance(${attendance.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteAttendance(${attendance.id})"
                    >
                        Delete
                    </button>

                </td>
            `;

            tableBody.appendChild(row);

        });

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Failed to load attendance records.
                </td>
            </tr>
        `;
    }
}


// ========================================
// CREATE / UPDATE Attendance
// ========================================

document
    .getElementById("attendanceForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const id =
            document.getElementById("attendanceId").value;

        const studentName =
            document.getElementById("studentName").value;

        const studentId =
            document.getElementById("studentId").value;

        const course =
            document.getElementById("course").value;

        const date =
            document.getElementById("date").value;

        const status =
            document.getElementById("status").value;


        const attendanceData = {

            studentName: studentName,

            studentId: Number(studentId),

            course: course,

            date: date,

            status: status

        };


        try {

            let response;

            // UPDATE
            if (id) {

                response = await fetch(`${API_URL}/${id}`, {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(attendanceData)

                });

            }

            // CREATE
            else {

                response = await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(attendanceData)

                });

            }


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message || "Operation failed"
                );

            }


            if (id) {

                showMessage(
                    "Attendance updated successfully!",
                    "success"
                );

            } else {

                showMessage(
                    "Attendance added successfully!",
                    "success"
                );

            }


            resetForm();

            loadAttendance();


        } catch (error) {

            console.error(error);

            showMessage(
                error.message,
                "error"
            );

        }

    });


// ========================================
// GET Single Attendance
// ========================================

async function editAttendance(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);


        if (!response.ok) {

            throw new Error(
                "Attendance record not found"
            );

        }


        const attendance =
            await response.json();


        document.getElementById("attendanceId").value =
            attendance.id;

        document.getElementById("studentName").value =
            attendance.studentName;

        document.getElementById("studentId").value =
            attendance.studentId;

        document.getElementById("course").value =
            attendance.course;

        document.getElementById("date").value =
            formatDateForInput(attendance.date);

        document.getElementById("status").value =
            attendance.status;


        document.getElementById("formTitle").textContent =
            "Edit Attendance";

        document.getElementById("submitBtn").textContent =
            "Update Attendance";

        document.getElementById("cancelBtn").style.display =
            "inline-block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

}


// ========================================
// DELETE Attendance
// ========================================

async function deleteAttendance(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this attendance record?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/${id}`, {

                method: "DELETE"

            });


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message || "Delete failed"
            );

        }


        showMessage(
            "Attendance deleted successfully!",
            "success"
        );


        loadAttendance();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );

    }

}


// ========================================
// Cancel Edit
// ========================================

function cancelEdit() {

    resetForm();

}


// ========================================
// Reset Form
// ========================================

function resetForm() {

    document
        .getElementById("attendanceForm")
        .reset();


    document.getElementById("attendanceId").value =
        "";


    document.getElementById("formTitle").textContent =
        "Add Attendance";


    document.getElementById("submitBtn").textContent =
        "Add Attendance";


    document.getElementById("cancelBtn").style.display =
        "none";

}


// ========================================
// Show Message
// ========================================

function showMessage(message, type) {

    const messageElement =
        document.getElementById("message");


    messageElement.textContent =
        message;


    messageElement.className =
        type;


    setTimeout(() => {

        messageElement.textContent = "";

        messageElement.className = "";

    }, 3000);

}


// ========================================
// Date Formatting
// ========================================

function formatDate(date) {

    if (!date) {
        return "";
    }

    return String(date).substring(0, 10);

}


function formatDateForInput(date) {

    if (!date) {
        return "";
    }

    return String(date).substring(0, 10);

}


// ========================================
// Initial Load
// ========================================

loadAttendance();