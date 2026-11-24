import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Cloudinary upload if credentials are provided in env
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret && !cloudName.includes("demo")) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await uploadRes.json();
      return NextResponse.json({ url: data.secure_url });
    }

    // Fallback: return high quality sample image URL
    return NextResponse.json({
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      note: "Using demo image fallback. Configure CLOUDINARY_* environment variables for live cloud uploads.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
