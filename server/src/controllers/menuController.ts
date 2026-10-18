import { Request, Response } from "express";
import { MenuItem } from "../models/MenuItem";

export const getMenuItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const filter: Record<string, unknown> = { isAvailable: true };

    if (category && category !== "all") {
      filter.category = category;
    }

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu items", error: (error as Error).message });
  }
};

export const getMenuItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error: (error as Error).message });
  }
};