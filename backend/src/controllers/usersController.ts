import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import db from "../config/db";
import { generatePassword } from '../utils/password';
import { sendMail } from '../utils/mail';
import { RowDataPacket, ResultSetHeader } from "mysql2";








// Get All Users
export const getUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const organization_id = req.user!.organization_id;
//  console.log("Organization ID:", organization_id); // Debugging line to check the organization_id
    const [rows]: any = await db.query(
      `
      SELECT
        id,
        organization_id,
        temple_id,
        name,
        user_code,
        email,
        phone,
        user_type,
        status,
        force_password_reset,
        created_at
      FROM users
      WHERE organization_id = ?
        AND deleted_at IS NULL
      ORDER BY id DESC
      `,
      [organization_id]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};


//  * Get All users (Organization Based) also  ok not impimated

//  carect user by orgination 
//  caret user by temple validate and impimate nut not immapia te  need to do it

// Get Single User
export const getUser = async (
  req: Request,
  res: Response
) => {
  try {
    const organization_id = req.user!.organization_id;
    const { id } = req.params;

    const [rows]: any = await db.query(
      `
      SELECT
        id,
        organization_id,
        temple_id,
        name,
        user_code,
        email,
        phone,
        user_type,
        status,
        force_password_reset,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
        AND organization_id = ?
        AND deleted_at IS NULL
      LIMIT 1
      `,
      [id, organization_id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// Create User

// export const createUser = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const organization_id = req.user!.organization_id;

//     const {
//       temple_id,
//       name,
//       email,
//       phone,
//       password,
//       user_type,
//       status,
//       force_password_reset,
//     } = req.body;

//     // -----------------------------
//     // Validate required fields
//     // -----------------------------
//     if (!name || !email || !password || !user_type) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, email, password and user type are required",
//       });
//     }

//     // -----------------------------
//     // Validate temple belongs to organization
//     // -----------------------------
//     if (temple_id) {
//       const [temples]: any = await db.query(
//         `
//         SELECT id
//         FROM temples
//         WHERE id = ?
//           AND organization_id = ?
//           AND deleted_at IS NULL
//         LIMIT 1
//         `,
//         [temple_id, organization_id]
//       );

//       if (!temples.length) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid temple for this organization",
//         });
//       }
//     }

//     // -----------------------------
//     // Check duplicate email
//     // -----------------------------
//     const [exists]: any = await db.query(
//       `
//       SELECT id
//       FROM users
//       WHERE organization_id = ?
//         AND email = ?
//         AND deleted_at IS NULL
//       LIMIT 1
//       `,
//       [organization_id, email]
//     );

//     if (exists.length) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already exists in this organization",
//       });
//     }

//     // -----------------------------
//     // Hash password
//     // -----------------------------
//     const password_hash = await bcrypt.hash(password, 10);

//     // -----------------------------
//     // Create user
//     // -----------------------------
//     await db.query(
//       `
//       INSERT INTO users (
//         organization_id,
//         temple_id,
//         name,
//         email,
//         phone,
//         password_hash,
//         user_type,
//         status,
//         force_password_reset
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `,
//       [
//         organization_id,
//         temple_id || null,
//         name,
//         email,
//         phone || null,
//         password_hash,
//         user_type,
//         status || "active",
//         force_password_reset ? 1 : 0,
//       ]
//     );

//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//     });

//   } catch (error: any) {
//     console.error("Create User Error:", error);

//     // MySQL duplicate key
//     if (error.code === "ER_DUP_ENTRY") {
//       return res.status(400).json({
//         success: false,
//         message: "Email or phone already exists",
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Failed to create user",
//     });
//   }
// };


const ALLOWED_USER_TYPES = [
  "org_admin",
  "temple_admin",
  "trustee",
  "president",
  "treasurer",
  "user",
];

export const createUser = async (
  req: Request,
  res: Response
) => {
  try {
    // const organization_id = req.user!.organization_id;
    const { organization_id } = req.user!;
    
    const {
      temple_id,
      name,
      email,
      phone,
      user_type,
      status = "Active",
      force_password_reset = true,
    } = req.body;

    // -----------------------------
    // Validate required fields
    // -----------------------------
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!user_type) {
      return res.status(400).json({
        success: false,
        message: "User type is required",
      });
    }

    // -----------------------------
    // Validate user type
    // -----------------------------
    if (!ALLOWED_USER_TYPES.includes(user_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
        allowed_types: ALLOWED_USER_TYPES,
      });
    }

    // -----------------------------
    // Validate status
    // -----------------------------
    const allowedStatuses = ["active", "inactive"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // -----------------------------
    // Validate temple
    // -----------------------------
    if (temple_id) {
      const [temples]: any = await db.query(
        `
        SELECT id
        FROM temples
        WHERE id = ?
          AND organization_id = ?
          AND deleted_at IS NULL
        LIMIT 1
        `,
        [temple_id, organization_id]
      );

      if (!temples.length) {
        return res.status(400).json({
          success: false,
          message: "Invalid temple for this organization",
        });
      }
    }

    // -----------------------------
    // Check duplicate email
    // -----------------------------
    const [emailExists]: any = await db.query(
      `
      SELECT id
      FROM users
      WHERE organization_id = ?
        AND email = ?
        AND deleted_at IS NULL
      LIMIT 1
      `,
      [organization_id, email.trim()]
    );

    if (emailExists.length) {
      return res.status(400).json({
        success: false,
        message: "Email already exists in this organization",
      });
    }

    // -----------------------------
    // Check duplicate phone
    // -----------------------------
    if (phone?.trim()) {
      const [phoneExists]: any = await db.query(
        `
        SELECT id
        FROM users
        WHERE organization_id = ?
          AND phone = ?
          AND deleted_at IS NULL
        LIMIT 1
        `,
        [organization_id, phone.trim()]
      );

      if (phoneExists.length) {
        return res.status(400).json({
          success: false,
          message: "Phone already exists in this organization",
        });
      }
    }

    // -----------------------------
    // Generate password
    // -----------------------------
    const rawPassword = generatePassword();

    // -----------------------------
    // Hash password
    // -----------------------------
    const passwordHash = await bcrypt.hash(
      rawPassword,
      12
    );

    // -----------------------------
    // Create user
    // -----------------------------
    const [result]: any = await db.query(
      `
      INSERT INTO users (
        organization_id,
        temple_id,
        name,
        email,
        phone,
        password_hash,
        user_type,
        status,
        force_password_reset
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        organization_id,
        temple_id || null,
        name.trim(),
        email.trim(),
        phone?.trim() || null,
        passwordHash,
        user_type,
        status,
        force_password_reset ? 1 : 0,
      ]
    );

    // -----------------------------
    // Send login details
    // -----------------------------
    try {
      await sendMail({
        to: email.trim(),
        subject: "Your User Account Has Been Created",
        text: `Hello ${name},

Your user account has been created successfully.

Login details:

Email: ${email}
Password: ${rawPassword}
Role: ${user_type}

Please log in and change your password immediately.

Thanks,
Team`,
      });
    } catch (mailError) {
      console.error(
        "User Email Error:",
        mailError
      );

      return res.status(201).json({
        success: true,
        user_id: result.insertId,
        message:
          "User created successfully, but email could not be sent.",
      });
    }

    return res.status(201).json({
      success: true,
      user_id: result.insertId,
      message:
        "User created successfully. Login details sent via email.",
    });

  } catch (error: any) {
    console.error(
      "Create User Error:",
      error
    );

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Email or phone already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

// Update User
export const updateUser = async (
  req: Request,
  res: Response
) => {
  try {
    const organization_id = req.user!.organization_id;
    const { id } = req.params;

    const {
      temple_id,
      name,
      email,
      phone,
      user_type,
      status,
      force_password_reset,
    } = req.body;

    const [user]: any = await db.query(
      `
      SELECT id
      FROM users
      WHERE id = ?
        AND organization_id = ?
        AND deleted_at IS NULL
      LIMIT 1
      `,
      [id, organization_id]
    );

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await db.query(
      `
      UPDATE users
      SET
        temple_id = ?,
        name = ?,
        email = ?,
        phone = ?,
        user_type = ?,
        status = ?,
        force_password_reset = ?,
        updated_at = NOW()
      WHERE id = ?
        AND organization_id = ?
      `,
      [
        temple_id,
        name,
        email,
        phone,
        user_type,
        status,
        force_password_reset ? 1 : 0,
        id,
        organization_id,
      ]
    );

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// Delete User (Soft Delete)
export const deleteUser = async (
  req: Request,
  res: Response
) => {
  try {
    const organization_id = req.user!.organization_id;
    const { id } = req.params;

    const [result]: any = await db.query(
      `
      UPDATE users
      SET deleted_at = NOW()
      WHERE id = ?
        AND organization_id = ?
        AND deleted_at IS NULL
      `,
      [id, organization_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};