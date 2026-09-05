// // controllers/tokens.controller.ts
// import { Request, Response } from "express";
// import db from "../config/db";
// import { ResultSetHeader, RowDataPacket } from "mysql2";

// /**
//  * GET ALL TOKENS
//  */

// export const getTokens = async (req: Request, res: Response) => {
//   try {
//     const organization_id = req.user!.organization_id;
//     const temple_id = req.user!.temple_id;

//     const [rows] = await db.query<RowDataPacket[]>(
//       `
//       SELECT 
//         t.id,
//         t.organization_id,
//         t.temple_id,
//         t.token_code,
//         t.token_name,
//         t.description,

//         -- Seva
//         t.seva_id,
//         s.seva_name,
//         s.amount AS seva_amount,

//         -- Deity
//         t.deity_id,
//         d.name AS deity_name,
//         d.status AS deity_status,
//         d.img_name AS deity_image,
//         d.code AS deity_code,
//         -- Token
//         t.display_order,
//         t.status AS status,

      
//         IFNULL(SUM(ti.quantity), 0) AS quantity,

//         t.created_at,
//         t.updated_at

//       FROM tokens t

//       LEFT JOIN sevas s 
//         ON t.seva_id = s.id

//       LEFT JOIN deities d 
//         ON t.deity_id = d.id

//       LEFT JOIN token_issues ti 
//         ON ti.token_id = t.id

//       WHERE t.organization_id = ?
//       AND t.temple_id = ?
//       AND t.status != 'deleted'

//       GROUP BY t.id

//       ORDER BY t.display_order ASC
//       `,
//       [organization_id, temple_id]
//     );

//     res.json({
//       success: true,
//       data: rows,
//     });

//   } catch (error: any) {
//     console.error("GET TOKENS ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch tokens",
//     });
//   }
// };
// /**
//  * GET TOKEN BY ID
//  */

// export const getTokenById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const organization_id = req.user!.organization_id;
//     const temple_id = req.user!.temple_id;

//     const [rows] = await db.query<RowDataPacket[]>(
//       `SELECT 
//         tk.*,

//         -- Temple Details
//         t.name AS temple_name,
//         t.email AS temple_email,
//         t.phone AS temple_phone,
//         t.img_name AS temple_logo,

//         CONCAT_WS(', ',
//           t.address_line1,
//           t.address_line2,
//           t.city,
//           t.state,
//           t.country,
//           t.pincode
//         ) AS temple_address,

//         -- Seva Details
//         s.seva_name,
//         s.amount AS seva_amount,

//         -- Deity Details
//         d.name AS deity_name,
//         d.code AS deity_code,
//         d.img_name AS deity_image

//       FROM tokens tk

//       LEFT JOIN temples t 
//         ON tk.temple_id = t.id

//       LEFT JOIN sevas s 
//         ON tk.seva_id = s.id

//       LEFT JOIN deities d 
//         ON tk.deity_id = d.id

//       WHERE tk.id = ?
//         AND tk.organization_id = ?
//         AND tk.temple_id = ?
//         AND tk.status = 'active'`,
//       [id, organization_id, temple_id]
//     );

//     if (!rows.length) {
//       return res.status(404).json({
//         success: false,
//         message: "Token not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: rows[0],
//     });

//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// /**
//  * CREATE TOKEN
//  */
// // export const createToken = async (req: Request, res: Response) => {
// //   try {

// //     const organization_id = req.user!.organization_id;
// //     const temple_id = req.user!.temple_id;

// //     const {
// //       token_name,
// //       description = null,
// //       seva_id,
// //       deity_id ,
// //       display_order = 1
// //     } = req.body;

// //     if (!token_name || !seva_id) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Required fields missing"
// //       });
// //     }

// //     // 🔥 STEP 1: Get last token_code
// //     const [rows]: any = await db.query(
// //       `SELECT token_code 
// //        FROM tokens 
// //        WHERE organization_id = ? 
// //        AND temple_id = ?
// //        ORDER BY id DESC 
// //        LIMIT 1`,
// //       [organization_id, temple_id]
// //     );

// //     let newTokenCode = "TKN001";

// //     if (rows.length > 0) {

// //       const lastCode = rows[0].token_code; // e.g. TKN005

// //       const numberPart = parseInt(lastCode.replace("TKN", ""), 10);

// //       const nextNumber = numberPart + 1;

// //       // format → TKN001
// //       newTokenCode = `TKN${String(nextNumber).padStart(3, "0")}`;
// //     }

// //     //  STEP 2: Insert
// //     const [result] = await db.query<ResultSetHeader>(
// //       `INSERT INTO tokens
// //       (organization_id, temple_id, token_code, token_name, description, seva_id, deity_id, display_order)
// //       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
// //       [
// //         organization_id,
// //         temple_id,
// //         newTokenCode,
// //         token_name,
// //         description,
// //         seva_id,
// //         deity_id,
// //         display_order
// //       ]
// //     );

// //     res.status(201).json({
// //       success: true,
// //       message: "Token created successfully",
// //       token_code: newTokenCode, // 👈 return generated code
// //       id: result.insertId
// //     });

// //   } catch (error: any) {

// //     if (error.code === "ER_DUP_ENTRY") {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Token already exists"
// //       });
// //     }

// //     res.status(500).json({
// //       success: false,
// //       message: error.message
// //     });
// //   }
// // };


// /**
//  * CREATE TOKEN
//  */
// export const createToken = async (req: Request, res: Response) => {
//   try {
//     const organization_id = req.user?.organization_id;
//     const temple_id = req.user?.temple_id;

//     const {
//       token_name,
//       description = null,
//       seva_id,
//       deity_id,
//       display_order = 1,
//     } = req.body;

//     console.log("CREATE TOKEN BODY:", req.body);
//     console.log("ORGANIZATION ID:", organization_id);
//     console.log("TEMPLE ID:", temple_id);

//     // =========================
//     // BASIC VALIDATION
//     // =========================

//     if (!organization_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Organization ID is missing",
//       });
//     }

//     if (!temple_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Temple ID is missing",
//       });
//     }

//     if (!token_name || !String(token_name).trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Token name is required",
//       });
//     }

//     if (!seva_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Seva is required",
//       });
//     }

//     if (!deity_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Deity is required",
//       });
//     }

//     // =========================
//     // CHECK SEVA
//     // =========================

//     const [sevaRows] = await db.query<RowDataPacket[]>(
//       `
//       SELECT id, seva_name, amount
//       FROM sevas
//       WHERE id = ?
//       AND organization_id = ?
//       AND temple_id = ?
//       LIMIT 1
//       `,
//       [Number(seva_id), organization_id, temple_id]
//     );

//     if (!sevaRows.length) {
//       return res.status(400).json({
//         success: false,
//         message: "Selected seva does not exist",
//       });
//     }

//     // =========================
//     // CHECK DEITY
//     // =========================

//     const [deityRows] = await db.query<RowDataPacket[]>(
//       `
//       SELECT id, name
//       FROM deities
//       WHERE id = ?
//       AND organization_id = ?
//       AND temple_id = ?
//       LIMIT 1
//       `,
//       [Number(deity_id), organization_id, temple_id]
//     );

//     if (!deityRows.length) {
//       return res.status(400).json({
//         success: false,
//         message: "Selected deity does not exist",
//       });
//     }

//     // =========================
//     // CHECK DUPLICATE TOKEN NAME
//     // =========================

//     const [existingToken] = await db.query<RowDataPacket[]>(
//       `
//       SELECT id, token_name, token_code
//       FROM tokens
//       WHERE organization_id = ?
//       AND temple_id = ?
//       AND token_name = ?
//       AND status != 'deleted'
//       LIMIT 1
//       `,
//       [
//         organization_id,
//         temple_id,
//         String(token_name).trim(),
//       ]
//     );

//     if (existingToken.length) {
//       return res.status(400).json({
//         success: false,
//         message: "Token name already exists",
//       });
//     }

//     // =========================
//     // GENERATE TOKEN CODE
//     // =========================

//     const [rows] = await db.query<RowDataPacket[]>(
//       `
//       SELECT token_code
//       FROM tokens
//       WHERE organization_id = ?
//       AND temple_id = ?
//       AND token_code IS NOT NULL
//       ORDER BY id DESC
//       LIMIT 1
//       `,
//       [organization_id, temple_id]
//     );

//     let newTokenCode = "TKN001";

//     if (rows.length > 0 && rows[0].token_code) {
//       const lastCode = String(rows[0].token_code);

//       const numberPart = parseInt(
//         lastCode.replace(/^TKN/i, ""),
//         10
//       );

//       if (!isNaN(numberPart)) {
//         newTokenCode = `TKN${String(
//           numberPart + 1
//         ).padStart(3, "0")}`;
//       }
//     }

//     console.log("NEW TOKEN CODE:", newTokenCode);

//     // =========================
//     // INSERT TOKEN
//     // =========================

//     const [result] = await db.query<ResultSetHeader>(
//       `
//       INSERT INTO tokens
//       (
//         organization_id,
//         temple_id,
//         token_code,
//         token_name,
//         description,
//         seva_id,
//         deity_id,
//         display_order,
//         status
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `,
//       [
//         organization_id,
//         temple_id,
//         newTokenCode,
//         String(token_name).trim(),
//         description || null,
//         Number(seva_id),
//         Number(deity_id),
//         Number(display_order) || 1,
//         "active",
//       ]
//     );

//     console.log("TOKEN CREATED:", result.insertId);

//     return res.status(201).json({
//       success: true,
//       message: "Token created successfully",
//       token_code: newTokenCode,
//       id: result.insertId,
//     });

//   } catch (error: any) {
//     console.error("CREATE TOKEN ERROR:", error);

//     // Duplicate database value
//     if (error.code === "ER_DUP_ENTRY") {
//       console.error("DUPLICATE ERROR:", error.sqlMessage);

//       return res.status(400).json({
//         success: false,
//         message: "Token already exists",
//         error: error.sqlMessage,
//       });
//     }

//     // Foreign key error
//     if (error.code === "ER_NO_REFERENCED_ROW_2") {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid seva or deity selected",
//         error: error.sqlMessage,
//       });
//     }

//     // Cannot insert NULL
//     if (error.code === "ER_BAD_NULL_ERROR") {
//       return res.status(400).json({
//         success: false,
//         message: "Required database field is missing",
//         error: error.sqlMessage,
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to create token",
//     });
//   }
// };



// /**
//  * UPDATE TOKEN
//  */
// export const updateToken = async (req: Request, res: Response) => {
//   try {

//     const { id } = req.params;
//     const organization_id = req.user!.organization_id;
//     const temple_id = req.user!.temple_id;

//     const {
//       token_code,
//       token_name,
//       description,
//       seva_id,
//       deity_id,
//       display_order,
//       status
//     } = req.body;

//     const [result] = await db.query<ResultSetHeader>(
//       `UPDATE tokens SET
//         token_code = ?,
//         token_name = ?,
//         description = ?,
//         seva_id = ?,
//         deity_id = ?,
//         display_order = ?,
//         status = ?,
//         updated_at = NOW()
//       WHERE id = ?
//       AND organization_id = ?
//       AND temple_id = ?`,
//       [
//         token_code,
//         token_name,
//         description,
//         seva_id,
//         deity_id,
//         display_order,
//         status,
//         id,
//         organization_id,
//         temple_id
//       ]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Token not found or unauthorized"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Token updated successfully"
//     });

//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// /**
//  * DELETE TOKEN
//  */
// export const deleteToken = async (req: Request, res: Response) => {
//   try {

//     const { id } = req.params;
//     const organization_id = req.user!.organization_id;
//     const temple_id = req.user!.temple_id;

//     const [result] = await db.query<ResultSetHeader>(
//       `DELETE FROM tokens
//        WHERE id = ?
//        AND organization_id = ?
//        AND temple_id = ?`,
//       [id, organization_id, temple_id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Token not found or unauthorized"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Token deleted successfully"
//     });

//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// export const issueToken = async (req: Request, res: Response) => {
//   try {
//     const {
//       token_id,
//       quantity,
//       seva_id,
//       seva_name,
//       deity_id,
//       seva_amount,
//       remark,
//     } = req.body;

//     const organization_id = req.user!.organization_id;
//     const temple_id = req.user!.temple_id;

//     //  Basic validation
//     if (!token_id || !quantity || !seva_amount) {
//       return res.status(400).json({
//         success: false,
//         message: "token_id, quantity and seva_amount are required",
//       });
//     }

//     const total_amount = quantity * seva_amount;

//     //  ALWAYS INSERT (no transaction needed)
//     await db.query(
//       `INSERT INTO token_issues 
//       (organization_id, temple_id, token_id, seva_id, seva_name, deity_id, quantity, seva_amount, total_amount, remark)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         organization_id,
//         temple_id,
//         token_id,
//         seva_id || null,
//         seva_name || "",
//         deity_id || null,
//         quantity,
//         seva_amount,
//         total_amount,
//         remark || null,
//       ]
//     );

//     res.json({
//       success: true,
//       message: "Token inserted successfully",
//     });

//   } catch (error: any) {
//     console.error("ISSUE TOKEN ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };




import {
  Request,
  Response,
} from "express";

import db from "../config/db";

import {
  ResultSetHeader,
  RowDataPacket,
} from "mysql2";

// =====================================================
// GET ALL TOKENS
// =====================================================

export const getTokens = async (
  req: Request,
  res: Response
) => {
  try {
    const organization_id =
      req.user?.organization_id;

    const temple_id =
      req.user?.temple_id;

    console.log(
      "GET TOKENS USER:",
      req.user
    );

    // -------------------------------------------------
    // AUTH CHECK
    // -------------------------------------------------

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message:
          "Organization ID missing from authenticated user",
      });
    }

    if (!temple_id) {
      return res.status(400).json({
        success: false,
        message:
          "Temple ID missing from authenticated user",
      });
    }

    // -------------------------------------------------
    // QUERY
    // -------------------------------------------------

    const [rows] =
      await db.query<RowDataPacket[]>(
        `
        SELECT

          t.id,

          t.organization_id,

          t.temple_id,

          t.token_code,

          t.token_name,

          t.description,

          t.seva_id,

          s.seva_name,

          s.amount AS seva_amount,

          t.deity_id,

          d.name AS deity_name,

          d.status AS deity_status,

          d.img_name AS deity_image,

          d.code AS deity_code,

          t.display_order,

          t.status,

          IFNULL(
            SUM(ti.quantity),
            0
          ) AS quantity,

          t.created_at,

          t.updated_at

        FROM tokens t

        LEFT JOIN sevas s
          ON t.seva_id = s.id

        LEFT JOIN deities d
          ON t.deity_id = d.id

        LEFT JOIN token_issues ti
          ON ti.token_id = t.id

        WHERE
          t.organization_id = ?

          AND t.temple_id = ?

          AND t.status != 'deleted'

        GROUP BY t.id

        ORDER BY
          t.display_order ASC,
          t.id DESC
        `,
        [
          organization_id,
          temple_id,
        ]
      );

    return res.json({
      success: true,
      data: rows,
    });

  } catch (error: any) {

    console.error(
      "GET TOKENS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.sqlMessage ||
        error?.message ||
        "Failed to fetch tokens",
    });
  }
};

// =====================================================
// GET TOKEN BY ID
// =====================================================

export const getTokenById = async (
  req: Request,
  res: Response
) => {
  try {

    const { id } = req.params;

    const organization_id =
      req.user?.organization_id;

    const temple_id =
      req.user?.temple_id;

    // -------------------------------------------------
    // AUTH
    // -------------------------------------------------

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message:
          "Organization ID missing from authenticated user",
      });
    }

    if (!temple_id) {
      return res.status(400).json({
        success: false,
        message:
          "Temple ID missing from authenticated user",
      });
    }

    // -------------------------------------------------
    // QUERY
    // -------------------------------------------------

    const [rows] =
      await db.query<RowDataPacket[]>(
        `
        SELECT

          tk.*,

          t.name AS temple_name,

          t.email AS temple_email,

          t.phone AS temple_phone,

          t.img_name AS temple_logo,

          CONCAT_WS(
            ', ',
            t.address_line1,
            t.address_line2,
            t.city,
            t.state,
            t.country,
            t.pincode
          ) AS temple_address,

          s.seva_name,

          s.amount AS seva_amount,

          d.name AS deity_name,

          d.code AS deity_code,

          d.img_name AS deity_image

        FROM tokens tk

        LEFT JOIN temples t
          ON tk.temple_id = t.id

        LEFT JOIN sevas s
          ON tk.seva_id = s.id

        LEFT JOIN deities d
          ON tk.deity_id = d.id

        WHERE
          tk.id = ?

          AND tk.organization_id = ?

          AND tk.temple_id = ?

          AND tk.status != 'deleted'

        LIMIT 1
        `,
        [
          id,
          organization_id,
          temple_id,
        ]
      );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Token not found",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });

  } catch (error: any) {

    console.error(
      "GET TOKEN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.sqlMessage ||
        error?.message ||
        "Failed to fetch token",
    });
  }
};

// =====================================================
// CREATE TOKEN
// =====================================================

export const createToken = async (
  req: Request,
  res: Response
) => {

  try {

    console.log(
      "CREATE TOKEN BODY:",
      req.body
    );

    console.log(
      "CREATE TOKEN USER:",
      req.user
    );

    const organization_id =
      req.user?.organization_id;

    const temple_id =
      req.user?.temple_id;

    // -------------------------------------------------
    // AUTH CHECK
    // -------------------------------------------------

    if (!organization_id) {
      console.error(
        "organization_id is undefined"
      );

      return res.status(400).json({
        success: false,
        message:
          "Organization ID missing from authenticated user",
      });
    }

    if (!temple_id) {
      return res.status(400).json({
        success: false,
        message:
          "Temple ID missing from authenticated user",
      });
    }

    // -------------------------------------------------
    // BODY
    // -------------------------------------------------

    const {
      token_name,
      description = null,
      seva_id,
      deity_id,
      display_order = 1,
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !token_name ||
      !String(token_name).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Token name is required",
      });
    }

    if (
      seva_id === undefined ||
      seva_id === null ||
      Number.isNaN(
        Number(seva_id)
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Seva is required",
      });
    }

    if (
      deity_id === undefined ||
      deity_id === null ||
      Number.isNaN(
        Number(deity_id)
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Deity is required",
      });
    }

    const cleanTokenName =
      String(token_name).trim();

    const cleanSevaId =
      Number(seva_id);

    const cleanDeityId =
      Number(deity_id);

    const cleanDisplayOrder =
      Number(display_order) || 1;

    // -------------------------------------------------
    // CHECK SEVA
    // -------------------------------------------------

    const [sevaRows] =
      await db.query<RowDataPacket[]>(
        `
        SELECT
          id,
          seva_name,
          amount
        FROM sevas

        WHERE
          id = ?

          AND organization_id = ?

          AND temple_id = ?

        LIMIT 1
        `,
        [
          cleanSevaId,
          organization_id,
          temple_id,
        ]
      );

    if (!sevaRows.length) {
      return res.status(400).json({
        success: false,
        message:
          "Selected Seva does not belong to this temple",
      });
    }

    // -------------------------------------------------
    // CHECK DEITY
    // -------------------------------------------------

    const [deityRows] =
      await db.query<RowDataPacket[]>(
        `
        SELECT
          id,
          name
        FROM deities

        WHERE
          id = ?

          AND organization_id = ?

          AND temple_id = ?

        LIMIT 1
        `,
        [
          cleanDeityId,
          organization_id,
          temple_id,
        ]
      );

    if (!deityRows.length) {
      return res.status(400).json({
        success: false,
        message:
          "Selected Deity does not belong to this temple",
      });
    }

    // -------------------------------------------------
    // DUPLICATE TOKEN NAME
    // -------------------------------------------------

    const [duplicateRows] =
      await db.query<RowDataPacket[]>(
        `
        SELECT
          id,
          token_code
        FROM tokens

        WHERE
          organization_id = ?

          AND temple_id = ?

          AND token_name = ?

          AND status != 'deleted'

        LIMIT 1
        `,
        [
          organization_id,
          temple_id,
          cleanTokenName,
        ]
      );

    if (duplicateRows.length) {
      return res.status(400).json({
        success: false,
        message:
          "Token with this name already exists",
      });
    }

    // -------------------------------------------------
    // GENERATE TOKEN CODE
    // -------------------------------------------------

    const [lastRows] =
      await db.query<RowDataPacket[]>(
        `
        SELECT token_code

        FROM tokens

        WHERE
          organization_id = ?

          AND temple_id = ?

        ORDER BY id DESC

        LIMIT 1
        `,
        [
          organization_id,
          temple_id,
        ]
      );

    let newTokenCode =
      "TKN001";

    if (
      lastRows.length &&
      lastRows[0].token_code
    ) {

      const lastCode =
        String(
          lastRows[0].token_code
        );

      const numberPart =
        parseInt(
          lastCode.replace(
            "TKN",
            ""
          ),
          10
        );

      if (
        !Number.isNaN(
          numberPart
        )
      ) {

        newTokenCode =
          `TKN${String(
            numberPart + 1
          ).padStart(3, "0")}`;
      }
    }

    // -------------------------------------------------
    // INSERT
    // -------------------------------------------------

    const [result] =
      await db.query<ResultSetHeader>(
        `
        INSERT INTO tokens
        (
          organization_id,
          temple_id,
          token_code,
          token_name,
          description,
          seva_id,
          deity_id,
          display_order,
          status,
          created_at,
          updated_at
        )

        VALUES
        (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          'active',
          NOW(),
          NOW()
        )
        `,
        [
          organization_id,
          temple_id,
          newTokenCode,
          cleanTokenName,
          description,
          cleanSevaId,
          cleanDeityId,
          cleanDisplayOrder,
        ]
      );

    // -------------------------------------------------
    // SUCCESS
    // -------------------------------------------------

    console.log(
      "TOKEN CREATED:",
      {
        id: result.insertId,
        token_code: newTokenCode,
      }
    );

    return res.status(201).json({
      success: true,
      message:
        "Token created successfully",
      id: result.insertId,
      token_code: newTokenCode,
    });

  } catch (error: any) {

    console.error(
      "CREATE TOKEN ERROR:",
      error
    );

    console.error(
      "MYSQL CODE:",
      error?.code
    );

    console.error(
      "MYSQL MESSAGE:",
      error?.sqlMessage
    );

    // -------------------------------------------------
    // DUPLICATE
    // -------------------------------------------------

    if (
      error?.code ===
      "ER_DUP_ENTRY"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Token already exists",
      });
    }

    // -------------------------------------------------
    // FOREIGN KEY
    // -------------------------------------------------

    if (
      error?.code ===
      "ER_NO_REFERENCED_ROW_2"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Seva, Deity, Temple or Organization",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error?.sqlMessage ||
        error?.message ||
        "Failed to create token",
    });
  }
};

// =====================================================
// UPDATE TOKEN
// =====================================================

export const updateToken = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } =
      req.params;

    const organization_id =
      req.user?.organization_id;

    const temple_id =
      req.user?.temple_id;

    // -------------------------------------------------
    // AUTH
    // -------------------------------------------------

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message:
          "Organization ID missing from authenticated user",
      });
    }

    if (!temple_id) {
      return res.status(400).json({
        success: false,
        message:
          "Temple ID missing from authenticated user",
      });
    }

    // -------------------------------------------------
    // BODY
    // -------------------------------------------------

    const {
      token_name,
      description = null,
      seva_id,
      deity_id,
      display_order,
      status,
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !token_name ||
      !String(token_name).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Token name is required",
      });
    }

    if (
      seva_id === undefined ||
      seva_id === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Seva is required",
      });
    }

    if (
      deity_id === undefined ||
      deity_id === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Deity is required",
      });
    }

    // -------------------------------------------------
    // CHECK TOKEN
    // -------------------------------------------------

    const [tokenRows] =
      await db.query<RowDataPacket[]>(
        `
        SELECT id

        FROM tokens

        WHERE
          id = ?

          AND organization_id = ?

          AND temple_id = ?

        LIMIT 1
        `,
        [
          id,
          organization_id,
          temple_id,
        ]
      );

    if (!tokenRows.length) {
      return res.status(404).json({
        success: false,
        message:
          "Token not found",
      });
    }

    // -------------------------------------------------
    // CHECK SEVA
    // -------------------------------------------------

    const [sevaRows] =
      await db.query<RowDataPacket[]>(
        `
        SELECT id

        FROM sevas

        WHERE
          id = ?

          AND organization_id = ?

          AND temple_id = ?

        LIMIT 1
        `,
        [
          Number(seva_id),
          organization_id,
          temple_id,
        ]
      );

    if (!sevaRows.length) {
      return res.status(400).json({
        success: false,
        message:
          "Selected Seva does not belong to this temple",
      });
    }

    // -------------------------------------------------
    // CHECK DEITY
    // -------------------------------------------------

    const [deityRows] =
      await db.query<RowDataPacket[]>(
        `
        SELECT id

        FROM deities

        WHERE
          id = ?

          AND organization_id = ?

          AND temple_id = ?

        LIMIT 1
        `,
        [
          Number(deity_id),
          organization_id,
          temple_id,
        ]
      );

    if (!deityRows.length) {
      return res.status(400).json({
        success: false,
        message:
          "Selected Deity does not belong to this temple",
      });
    }

    // -------------------------------------------------
    // DUPLICATE NAME
    // -------------------------------------------------

    const [duplicateRows] =
      await db.query<RowDataPacket[]>(
        `
        SELECT id

        FROM tokens

        WHERE
          organization_id = ?

          AND temple_id = ?

          AND token_name = ?

          AND id != ?

          AND status != 'deleted'

        LIMIT 1
        `,
        [
          organization_id,
          temple_id,
          String(token_name).trim(),
          id,
        ]
      );

    if (duplicateRows.length) {
      return res.status(400).json({
        success: false,
        message:
          "Another token with this name already exists",
      });
    }

    // -------------------------------------------------
    // UPDATE
    // -------------------------------------------------

    const [result] =
      await db.query<ResultSetHeader>(
        `
        UPDATE tokens

        SET
          token_name = ?,
          description = ?,
          seva_id = ?,
          deity_id = ?,
          display_order = ?,
          status = ?,
          updated_at = NOW()

        WHERE
          id = ?

          AND organization_id = ?

          AND temple_id = ?
        `,
        [
          String(token_name).trim(),
          description,
          Number(seva_id),
          Number(deity_id),
          Number(display_order) || 1,
          status || "active",
          id,
          organization_id,
          temple_id,
        ]
      );

    if (
      result.affectedRows === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Token not found",
      });
    }

    return res.json({
      success: true,
      message:
        "Token updated successfully",
    });

  } catch (error: any) {

    console.error(
      "UPDATE TOKEN ERROR:",
      error
    );

    if (
      error?.code ===
      "ER_DUP_ENTRY"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Token already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error?.sqlMessage ||
        error?.message ||
        "Failed to update token",
    });
  }
};

// =====================================================
// DELETE TOKEN
// =====================================================

export const deleteToken = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } =
      req.params;

    const organization_id =
      req.user?.organization_id;

    const temple_id =
      req.user?.temple_id;

    // -------------------------------------------------
    // AUTH
    // -------------------------------------------------

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message:
          "Organization ID missing from authenticated user",
      });
    }

    if (!temple_id) {
      return res.status(400).json({
        success: false,
        message:
          "Temple ID missing from authenticated user",
      });
    }

    // -------------------------------------------------
    // SOFT DELETE
    // -------------------------------------------------

    const [result] =
      await db.query<ResultSetHeader>(
        `
        UPDATE tokens

        SET
          status = 'deleted',
          updated_at = NOW()

        WHERE
          id = ?

          AND organization_id = ?

          AND temple_id = ?

          AND status != 'deleted'
        `,
        [
          id,
          organization_id,
          temple_id,
        ]
      );

    if (
      result.affectedRows === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Token not found",
      });
    }

    return res.json({
      success: true,
      message:
        "Token deleted successfully",
    });

  } catch (error: any) {

    console.error(
      "DELETE TOKEN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.sqlMessage ||
        error?.message ||
        "Failed to delete token",
    });
  }
};

// =====================================================
// ISSUE TOKEN
// =====================================================

export const issueToken = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      token_id,
      quantity,
      seva_id,
      seva_name,
      deity_id,
      seva_amount,
      remark,
    } = req.body;

    const organization_id =
      req.user?.organization_id;

    const temple_id =
      req.user?.temple_id;

    // -------------------------------------------------
    // AUTH
    // -------------------------------------------------

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message:
          "Organization ID missing from authenticated user",
      });
    }

    if (!temple_id) {
      return res.status(400).json({
        success: false,
        message:
          "Temple ID missing from authenticated user",
      });
    }

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !token_id ||
      !quantity ||
      seva_amount === undefined ||
      seva_amount === null
    ) {
      return res.status(400).json({
        success: false,
        message:
          "token_id, quantity and seva_amount are required",
      });
    }

    // -------------------------------------------------
    // CHECK TOKEN
    // -------------------------------------------------

    const [tokenRows] =
      await db.query<RowDataPacket[]>(
        `
        SELECT
          id,
          token_name,
          seva_id,
          deity_id

        FROM tokens

        WHERE
          id = ?

          AND organization_id = ?

          AND temple_id = ?

          AND status = 'active'

        LIMIT 1
        `,
        [
          token_id,
          organization_id,
          temple_id,
        ]
      );

    if (!tokenRows.length) {
      return res.status(404).json({
        success: false,
        message:
          "Token not found",
      });
    }

    // -------------------------------------------------
    // TOTAL
    // -------------------------------------------------

    const total_amount =
      Number(quantity) *
      Number(seva_amount);

    // -------------------------------------------------
    // INSERT
    // -------------------------------------------------

    const [result] =
      await db.query<ResultSetHeader>(
        `
        INSERT INTO token_issues
        (
          organization_id,
          temple_id,
          token_id,
          seva_id,
          seva_name,
          deity_id,
          quantity,
          seva_amount,
          total_amount,
          remark
        )

        VALUES
        (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        `,
        [
          organization_id,
          temple_id,
          Number(token_id),
          seva_id
            ? Number(seva_id)
            : null,
          seva_name || "",
          deity_id
            ? Number(deity_id)
            : null,
          Number(quantity),
          Number(seva_amount),
          total_amount,
          remark || null,
        ]
      );

    return res.status(201).json({
      success: true,
      message:
        "Token issued successfully",
      id: result.insertId,
      total_amount,
    });

  } catch (error: any) {

    console.error(
      "ISSUE TOKEN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.sqlMessage ||
        error?.message ||
        "Failed to issue token",
    });
  }
};

