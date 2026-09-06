import { getAboutMe, updateAboutMe } from "../../server/controllers/aboutMeController";
import { authenticate, authorize } from "../../server/middleware/auth";

export async function GET() {
  try {
    return Response.json({ success: true, data: await getAboutMe() });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  return authenticate(req, async () => authorize("admin", "staff-member")(req, async () => {
    try {
      return Response.json({ success: true, data: await updateAboutMe(await req.json()) });
    } catch (error) {
      return Response.json({ success: false, error: error.message }, { status: 400 });
    }
  }));
}