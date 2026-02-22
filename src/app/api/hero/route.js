import { 
  getHeroSlides, 
  createHeroSlide, 
  updateHeroSlide, 
  deleteHeroSlide,
  reorderHeroSlides,
  getHeroContent, 
  updateHeroContent 
} from "../../server/controllers/heroController";

// Support both /api/hero (for slides) and /api/hero/content (for profile data)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    // If requesting content/profile data
    if (type === 'content') {
      const content = await getHeroContent();
      return Response.json({ success: true, content });
    }

    // Default: return slides
    const slides = await getHeroSlides();
    return Response.json({ success: true, slides });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST new slide
export async function POST(req) {
  try {
    const slideData = await req.json();
    
    // Validate required fields
    if (!slideData.title || !slideData.subtitle || !slideData.ctaLabel || !slideData.ctaHref || !slideData.image) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newSlide = await createHeroSlide(slideData);
    return Response.json({ success: true, slide: newSlide }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT for updating or reordering
export async function PUT(req) {
  try {
    const body = await req.json();
    
    // If updating hero content
    if (body.type === 'content') {
      const updatedContent = await updateHeroContent(body.data);
      return Response.json({ success: true, content: updatedContent });
    }
    
    // If it's a reorder request with array of IDs
    if (body.reorder && Array.isArray(body.slideIds)) {
      const reorderedSlides = await reorderHeroSlides(body.slideIds);
      return Response.json({ success: true, slides: reorderedSlides });
    }

    // Otherwise it's an update of a single slide
    if (!body.slideId) {
      return Response.json(
        { success: false, error: "slideId or type required" },
        { status: 400 }
      );
    }

    const updatedSlide = await updateHeroSlide(body.slideId, body);
    return Response.json({ success: true, slide: updatedSlide });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE a slide
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slideId = searchParams.get('id');

    if (!slideId) {
      return Response.json(
        { success: false, error: "Slide ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteHeroSlide(slideId);
    return Response.json({ success: true, ...result });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
