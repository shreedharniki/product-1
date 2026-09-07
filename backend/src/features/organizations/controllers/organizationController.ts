import type { Request, Response } from "express"

import {
  fetchOrganizations,
} from "../services/organizationService"

export const getOrganizations = async (
  _req: Request,
  res: Response,
) => {
  try {
    const organizations = await fetchOrganizations()

    return res.status(200).json({
      success: true,
      data: organizations,
    })
  } catch (error) {
    console.error(
      "GET ORGANIZATIONS ERROR:",
      error,
    )

    return res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}