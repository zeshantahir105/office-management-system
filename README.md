# office-management-system

<!-- ENVIRONMENT SETUP -->

<!-- Update the .env file -->

#local
NODE_ENV=local
DB_USERNAME=username
DB_PASSWORD=password
DB_NAME=db_name
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
JWT_SECRET=VcUc8Mqp0186DmZ4IdV+gCTUkt/cFOyed5RNI7LrQeil5usqXFoSGrwa9tJy82zQRbSjJFcq8cDHYyVDzyg8ew==

Run the migrations via command “npm run migrate”

Port using for local : 3000

<!-- Key Features -->

<!-- Employee Authentication -->

Employees can sign up & log in
Use database sessions in NodeJS.
Admin can add notes for each employee.
Admins can add/update/delete all employees.
Employees can only change their own data.
Employees cannot delete themselves.

<!-- Attendance Management -->

Employees can mark their daily attendance.
Employees can view their own past attendance records.
Employees can modify their attendance records within 5 minutes of submission.
Admin can add notes for each attendance.
Admin can view all attendance between date ranges.
Admin can add/update/delete all notes.
Employees can only view notes for their own attendance.

<!-- Leave Management -->

Allow employees to ask for leaves.
Each leave request will have a default “pending” status.
Admins should be allowed to approve or reject leave requests.
Admins should have the option to leave additional notes.
Employees can reply to notes.
Employees can only see their own leave notes ( And the admin notes ).
Admins should have the option to check leaves between a date range.

<!-- Github Repo -->

https://github.com/zeshantahir105/office-management-system

<!-- README Doc with Endpoints -->

https://docs.google.com/document/d/1YjpHpnp3kRmFlsXBspuqKeKKpKWYb-mhZimLvEV27Xw/edit?usp=sharing
