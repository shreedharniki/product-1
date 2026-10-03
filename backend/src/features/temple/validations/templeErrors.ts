// import type { Response } from "express";

// interface DatabaseError {
//     code?: string;
//     errno?: number;
//     sqlMessage?: string;
//     message?: string;
// }

// export const handleTempleError = (
//     error: unknown,
//     res: Response
// ): Response => {
//     const dbError = error as DatabaseError;

//     /*
//      * MySQL duplicate entry
//      */
//     if (
//         dbError.code === "ER_DUP_ENTRY" ||
//         dbError.errno === 1062
//     ) {
//         const message = dbError.sqlMessage || dbError.message || "";

//         /*
//          * GST
//          */
//         if (
//             message.includes("uk_temple_gst_number") ||
//             message.includes("temp_gst_number")
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 field: "temp_gst_number",
//                 message: "GST number already exists.",
//             });
//         }

//         /*
//          * Email
//          */
//         if (
//             message.includes("uk_temple_email") ||
//             message.includes("temp_email")
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 field: "temp_email",
//                 message: "Temple email already exists.",
//             });
//         }

//         /*
//          * Phone
//          */
//         if (
//             message.includes("uk_temple_phone") ||
//             message.includes("temp_phone")
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 field: "temp_phone",
//                 message: "Temple phone number already exists.",
//             });
//         }

//         /*
//          * Registration number
//          */
//         if (
//             message.includes("uk_temple_registration_number") ||
//             message.includes("temp_registration_number")
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 field: "temp_registration_number",
//                 message: "Temple registration number already exists.",
//             });
//         }

//         /*
//          * Slug
//          */
//         if (
//             message.includes("uk_temple_slug") ||
//             message.includes("temp_slug")
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 field: "temp_slug",
//                 message: "Temple name already exists.",
//             });
//         }

//         /*
//          * Generic duplicate
//          */
//         return res.status(400).json({
//             success: false,
//             message: "A temple with the same information already exists.",
//         });
//     }

//     /*
//      * Foreign key errors
//      */
//     if (
//         dbError.code === "ER_NO_REFERENCED_ROW_2" ||
//         dbError.errno === 1452
//     ) {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid organization or related record.",
//         });
//     }

//     /*
//      * Data too long
//      */
//     if (
//         dbError.code === "ER_DATA_TOO_LONG" ||
//         dbError.errno === 1406
//     ) {
//         return res.status(400).json({
//             success: false,
//             message: "One or more fields contain too much data.",
//         });
//     }

//     /*
//      * Invalid SQL value
//      */
//     if (
//         dbError.code === "ER_TRUNCATED_WRONG_VALUE" ||
//         dbError.errno === 1292
//     ) {
//         return res.status(400).json({
//             success: false,
//             message: "One or more fields contain an invalid value.",
//         });
//     }

//     /*
//      * Application error
//      */
//     if (error instanceof Error) {
//         return res.status(400).json({
//             success: false,
//             message: error.message,
//         });
//     }

//     /*
//      * Unknown error
//      */
//     return res.status(500).json({
//         success: false,
//         message: "Internal server error.",
//     });
// };




import type { Response } from "express"

interface DatabaseError {
  code?: string
  errno?: number
  sqlMessage?: string
  message?: string
  sqlState?: string
}

/**
 * Convert unknown errors into a safe HTTP response.
 */
export const handleTempleError = (
  error: unknown,
  res: Response,
): Response => {
  const dbError = error as DatabaseError

  const code = dbError.code
  const errno = dbError.errno

  const message = (
    dbError.sqlMessage ??
    dbError.message ??
    ""
  ).toLowerCase()

  /*
   * =========================================================
   * MYSQL DUPLICATE ENTRY
   * =========================================================
   */
  if (
    code === "ER_DUP_ENTRY" ||
    errno === 1062
  ) {
    /*
     * GST
     */
    if (
      message.includes("uk_temple_gst_number") ||
      message.includes("temp_gst_number") ||
      message.includes("gst")
    ) {
      return res.status(409).json({
        success: false,
        field: "temp_gst_number",
        message: "GST number already exists.",
      })
    }

    /*
     * Email
     */
    if (
      message.includes("uk_temple_email") ||
      message.includes("temp_email") ||
      message.includes("email")
    ) {
      return res.status(409).json({
        success: false,
        field: "temp_email",
        message: "Temple email already exists.",
      })
    }

    /*
     * Phone
     */
    if (
      message.includes("uk_temple_phone") ||
      message.includes("temp_phone") ||
      message.includes("phone")
    ) {
      return res.status(409).json({
        success: false,
        field: "temp_phone",
        message: "Temple phone number already exists.",
      })
    }

    /*
     * Registration number
     */
    if (
      message.includes("uk_temple_registration_number") ||
      message.includes("temp_registration_number") ||
      message.includes("registration_number")
    ) {
      return res.status(409).json({
        success: false,
        field: "temp_registration_number",
        message: "Temple registration number already exists.",
      })
    }

    /*
     * Slug
     */
    if (
      message.includes("uk_temple_slug") ||
      message.includes("temp_slug")
    ) {
      return res.status(409).json({
        success: false,
        field: "temp_slug",
        message: "Temple slug already exists.",
      })
    }

    /*
     * Generic duplicate
     */
    return res.status(409).json({
      success: false,
      message: "A temple name with the same information already exists.",
    })
  }

  /*
   * =========================================================
   * FOREIGN KEY ERROR
   * =========================================================
   */
  if (
    code === "ER_NO_REFERENCED_ROW_2" ||
    errno === 1452
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid organization or related record.",
    })
  }

  /*
   * =========================================================
   * FOREIGN KEY DELETE ERROR
   * =========================================================
   */
  if (
    code === "ER_ROW_IS_REFERENCED_2" ||
    errno === 1451
  ) {
    return res.status(409).json({
      success: false,
      message: "Temple cannot be deleted because related records exist.",
    })
  }

  /*
   * =========================================================
   * DATA TOO LONG
   * =========================================================
   */
  if (
    code === "ER_DATA_TOO_LONG" ||
    errno === 1406
  ) {
    return res.status(400).json({
      success: false,
      message: "One or more fields contain too much data.",
    })
  }

  /*
   * =========================================================
   * INVALID / TRUNCATED VALUE
   * =========================================================
   */
  if (
    code === "ER_TRUNCATED_WRONG_VALUE" ||
    errno === 1292
  ) {
    return res.status(400).json({
      success: false,
      message: "One or more fields contain an invalid value.",
    })
  }

  /*
   * =========================================================
   * NULL VALUE
   * =========================================================
   */
  if (
    code === "ER_BAD_NULL_ERROR" ||
    errno === 1048
  ) {
    return res.status(400).json({
      success: false,
      message: "A required field cannot be empty.",
    })
  }

  /*
   * =========================================================
   * UNKNOWN COLUMN
   * =========================================================
   */
  if (
    code === "ER_BAD_FIELD_ERROR" ||
    errno === 1054
  ) {
    console.error("Database column error:", error)

    return res.status(500).json({
      success: false,
      message: "Database configuration error.",
    })
  }

  /*
   * =========================================================
   * SQL SYNTAX ERROR
   * =========================================================
   */
  if (
    code === "ER_PARSE_ERROR" ||
    errno === 1064
  ) {
    console.error("SQL syntax error:", error)

    return res.status(500).json({
      success: false,
      message: "Database query error.",
    })
  }

  /*
   * =========================================================
   * APPLICATION ERROR
   * =========================================================
   *
   * Example:
   *   throw new Error("Organization ID not found")
   *   throw new Error("Invalid temple ID")
   */
  if (error instanceof Error) {
    const errorMessage = error.message

    if (
      errorMessage === "Organization ID not found"
    ) {
      return res.status(401).json({
        success: false,
        message: errorMessage,
      })
    }

    if (
      errorMessage === "Invalid organization ID"
    ) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      })
    }

    if (
      errorMessage === "Invalid temple ID"
    ) {
      return res.status(400).json({
        success: false,
        message: errorMessage,
      })
    }

    return res.status(400).json({
      success: false,
      message: errorMessage,
    })
  }

  /*
   * =========================================================
   * UNKNOWN ERROR
   * =========================================================
   */
  console.error("Unknown temple error:", error)

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  })
}
