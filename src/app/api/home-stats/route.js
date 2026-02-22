import {
  getHomeStats,
  createStat,
  updateStat,
  deleteStat,
  reorderStats,
  updateBackgroundColor,
} from "../../server/controllers/homeStatsController";

// GET all stats
export async function GET() {
  try {
    const statsDoc = await getHomeStats();
    return Response.json({ success: true, data: statsDoc });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST new stat
export async function POST(req) {
  try {
    const statData = await req.json();

    if (!statData.value || !statData.description) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newStat = await createStat(statData);
    return Response.json({ success: true, stat: newStat }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT for updating, reordering, or changing background
export async function PUT(req) {
  try {
    const body = await req.json();

    // Reorder stats
    if (body.reorder && Array.isArray(body.statIds)) {
      const reorderedStats = await reorderStats(body.statIds);
      return Response.json({ success: true, stats: reorderedStats });
    }

    // Update background color
    if (body.type === "backgroundColor") {
      const updated = await updateBackgroundColor(body.backgroundColor);
      return Response.json({ success: true, data: updated });
    }

    // Update single stat
    if (!body.statId) {
      return Response.json(
        { success: false, error: "statId is required" },
        { status: 400 }
      );
    }

    const updatedStat = await updateStat(body.statId, body);
    return Response.json({ success: true, stat: updatedStat });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE a stat
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const statId = searchParams.get("id");

    if (!statId) {
      return Response.json(
        { success: false, error: "Stat ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteStat(statId);
    return Response.json({ success: true, ...result });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
