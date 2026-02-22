import { connectDB } from '@/utils/db';
import {
  getAllLanguagesServices,
  getLanguages,
  getServices,
  createLanguageService,
  updateLanguageService,
  deleteLanguageService,
  reorderLanguagesServices,
} from '@/app/server/controllers/languageServicesController';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let result;
    if (type === 'language') {
      result = await getLanguages();
    } else if (type === 'service') {
      result = await getServices();
    } else {
      result = await getAllLanguagesServices();
    }

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const result = await createLanguageService(data);
    return Response.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { id, action } = data;

    let result;
    if (action === 'reorder') {
      result = await reorderLanguagesServices(data.items);
    } else {
      result = await updateLanguageService(id, data);
    }

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const data = await request.json();
    const result = await deleteLanguageService(data.id);
    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
