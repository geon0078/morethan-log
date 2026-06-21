import { getPostBlocks } from "@/src/libs/apis"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  try {
    const blocks = await getPostBlocks(id as string)
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=60")
    res.status(200).json(blocks)
  } catch {
    res.status(500).json({ error: "Failed to fetch blocks" })
  }
}
