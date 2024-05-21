const db = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../models/users");

// Authentication
const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, roleType } = req.body;

    // Check if the email exists
    const userExists = await db.users.findOne({
      where: { email },
    });
    if (userExists) {
      return res
        .status(400)
        .send("Email is already associated with an account");
    }

    const encryptedPassword = await bcrypt.hash(
      password,
      bcrypt.genSaltSync(8)
    );

    await db.users.create({
      name,
      email,
      age,
      roleType,
      password: encryptedPassword,
    });

    return res.status(201).send("Registration successful");
  } catch (err) {
    console.log({ err });
    return res.status(500).send("Error in registering user");
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.users.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(404).json("User doesn't exist.");
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(404).json("Invalid Credentials");
    }

    // Authenticate user with jwt
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    // Creating user session
    db.user_sessions.create({
      token,
      userId: user.id,
    });

    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: token,
    });
  } catch (err) {
    console.log({ err });
    return res.status(500).send("Sign in error");
  }
};

// Employee Attendance
const markAttendance = async (req, res) => {
  const { status, dateTime } = req.body;
  const { userId, roleType } = req.user;
  const now = new Date().toISOString();
  const attendanceDate = new Date(dateTime).toISOString();
  if (roleType == "admin") {
    return res
      .status(404)
      .json("Admins are not allowed to mark the attendance.");
  }

  if (attendanceDate > now) {
    return res
      .status(400)
      .json("Bad Request! You cannot mark the future attendance.");
  }

  const prevAttendance = await db.attendance.findOne({
    where: { userId, dateTime },
  });

  if (prevAttendance != null) {
    const creationDate = new Date(prevAttendance.createdAt).toISOString();

    const diffInMs = Math.abs(now - creationDate);
    const diffInMinutes = diffInMs / (1000 * 60);

    if (diffInMinutes > 5) {
      return res
        .status(500)
        .send(
          "Unable to remark the attendance after 5 mins of the attendance creation."
        );
    }

    const response = await db.attendance.update(
      {
        status,
        dateTime,
      },
      {
        where: { userId, dateTime },
      }
    );

    if (response?.[0]) {
      return res.status(201).send("Attendance updated successfully");
    }

    return res.status(400).send(`Unable to update the attendance!`);
  }

  const response = await db.attendance.create({
    userId,
    status,
    dateTime,
  });

  if (response) {
    return res.status(201).send("Attendance marked successfully");
  }

  return res.status(400).send(`Unable to mark the attendance!`);
};

// Add attendance note
const addAttendanceNote = async (req, res) => {
  const { note, attendanceId, commenterId } = req.body;

  const attendance = await db.attendance.findOne({
    where: { attendanceId },
  });

  if (!attendance) {
    return res.status(404).json("Attendance doesn't exist.");
  }

  const response = await db.attendance_notes.create({
    attendanceId,
    note,
    commenterId,
  });

  if (response) {
    return res
      .status(201)
      .send(
        `Note "${note}" added successfully to the attendance with id "${attendanceId}"`
      );
  }

  return res.status(400).send(`Unable to add the note!`);
};

// Update attendance note
const updateAttendanceNote = async (req, res) => {
  const { note: updatedNote, noteId } = req.body;

  const response = await db.attendance_notes.update(
    {
      note: updatedNote,
    },
    {
      where: { noteId },
    }
  );

  if (response?.[0]) {
    return res.status(201).send(`Note updated successfully!`);
  }

  return res.status(400).send(`Unable to update the note!`);
};

// Delete attendance note
const deleteAttendanceNote = async (req, res) => {
  const { noteId } = req.body;
  const { userId, roleType } = req.user;

  const note = await db.attendance_notes.findOne({
    where: { noteId },
  });

  if (!note) {
    return res.status(404).json("Note doesn't exist.");
  }

  if (roleType != "admin" && userId != note.commenterId) {
    return res
      .status(401)
      .json("Unsucessful deletion! You can only delete your own notes.");
  }

  const response = await db.attendance_notes.destroy({
    where: { noteId },
  });

  if (response) {
    return res.status(201).send(`Note deleted successfully!`);
  }

  return res.status(400).send(`Unable to delete the note!`);
};

// View admin attendance notes
const viewAdminAttendanceNotes = async (req, res) => {
  const { attendanceId } = req.body;

  const adminNotes = await db.attendance_notes.findAll({
    where: { attendanceId },
    include: {
      model: db.attendance,
      as: "attendance",
      include: {
        model: db.users,
        as: "users",
        where: { roleType: "admin" },
      },
    },
  });

  if (!adminNotes?.length) {
    return res.status(404).json("Notes doesn't exist.");
  }

  res.status(200).send(adminNotes);
};

module.exports = {
  registerUser,
  signInUser,
  markAttendance,
  addAttendanceNote,
  updateAttendanceNote,
  deleteAttendanceNote,
  viewAdminAttendanceNotes,
};
