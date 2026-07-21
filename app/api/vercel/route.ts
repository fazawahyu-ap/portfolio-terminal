import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.MY_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "Token Vercel tidak ditemukan di .env" }, { status: 500 });
  }

  try {
    // Mengubah endpoint ke /projects agar mengambil daftar web yang unik
    const response = await fetch("https://api.vercel.com/v9/projects?limit=6", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", 
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Gagal terhubung ke Vercel API" }, { status: 500 });
  }
}