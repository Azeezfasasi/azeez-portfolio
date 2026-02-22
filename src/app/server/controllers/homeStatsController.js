import HomeStats from "../models/HomeStats";
import { connectDB } from "../../server/db/connect";
import mongoose from "mongoose";

// GET all stats
export async function getHomeStats() {
  await connectDB();
  let statsDoc = await HomeStats.findOne();

  // Initialize if doesn't exist
  if (!statsDoc) {
    statsDoc = await HomeStats.create({
      stats: [
        {
          _id: new mongoose.Types.ObjectId(),
          label: "Projects",
          value: "40+",
          description: "PROJECTS COMPLETED",
          icon: "CheckCircle2",
          order: 0,
          active: true,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          label: "Experience",
          value: "5+",
          description: "YEARS OF EXPERIENCE",
          icon: "Briefcase",
          order: 1,
          active: true,
        },
        {
          _id: new mongoose.Types.ObjectId(),
          label: "Clients",
          value: "30+",
          description: "TOTAL NUMBER OF CLIENTS",
          icon: "Users",
          order: 2,
          active: true,
        },
      ],
    });
  }

  return statsDoc || {};
}

// CREATE new stat
export async function createStat(statData) {
  await connectDB();

  const newStat = {
    _id: new mongoose.Types.ObjectId(),
    ...statData,
  };

  let statsDoc = await HomeStats.findOne();

  if (!statsDoc) {
    statsDoc = await HomeStats.create({ stats: [newStat] });
  } else {
    const maxOrder = statsDoc.stats.length > 0 
      ? Math.max(...statsDoc.stats.map(s => s.order || 0))
      : 0;

    newStat.order = maxOrder + 1;
    statsDoc.stats.push(newStat);
    await statsDoc.save();
  }

  return newStat;
}

// UPDATE stat
export async function updateStat(statId, statData) {
  await connectDB();

  let statsDoc = await HomeStats.findOne();

  if (!statsDoc) {
    throw new Error("Stats document not found");
  }

  const statIndex = statsDoc.stats.findIndex(
    (s) => s._id.toString() === statId
  );

  if (statIndex === -1) {
    throw new Error("Stat not found");
  }

  statsDoc.stats[statIndex] = {
    ...statsDoc.stats[statIndex],
    ...statData,
    _id: statsDoc.stats[statIndex]._id,
  };

  statsDoc.updatedAt = Date.now();
  await statsDoc.save();

  return statsDoc.stats[statIndex];
}

// DELETE stat
export async function deleteStat(statId) {
  await connectDB();

  let statsDoc = await HomeStats.findOne();

  if (!statsDoc) {
    throw new Error("Stats document not found");
  }

  statsDoc.stats = statsDoc.stats.filter(
    (s) => s._id.toString() !== statId
  );

  // Reorder remaining stats
  statsDoc.stats.forEach((stat, index) => {
    stat.order = index;
  });

  statsDoc.updatedAt = Date.now();
  await statsDoc.save();

  return { success: true, message: "Stat deleted successfully" };
}

// REORDER stats
export async function reorderStats(statIds) {
  await connectDB();

  let statsDoc = await HomeStats.findOne();

  if (!statsDoc) {
    throw new Error("Stats document not found");
  }

  const reorderedStats = statIds.map((id, index) => {
    const stat = statsDoc.stats.find((s) => s._id.toString() === id);
    if (stat) {
      stat.order = index;
    }
    return stat;
  }).filter(Boolean);

  statsDoc.stats = reorderedStats;
  statsDoc.updatedAt = Date.now();
  await statsDoc.save();

  return statsDoc.stats;
}

// UPDATE background color
export async function updateBackgroundColor(backgroundColor) {
  await connectDB();

  let statsDoc = await HomeStats.findOne();

  if (!statsDoc) {
    statsDoc = await HomeStats.create({ backgroundColor });
  } else {
    statsDoc.backgroundColor = backgroundColor;
    statsDoc.updatedAt = Date.now();
    await statsDoc.save();
  }

  return statsDoc;
}
