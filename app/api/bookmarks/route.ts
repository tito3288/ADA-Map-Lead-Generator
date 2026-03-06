import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { Bookmark } from "@/types";

export async function GET() {
  const snapshot = await db
    .collection("bookmarks")
    .orderBy("createdAt", "desc")
    .get();

  const bookmarks: Bookmark[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Bookmark[];

  return NextResponse.json({ bookmarks });
}

export async function POST(req: NextRequest) {
  const lead = await req.json();

  const createdAt = new Date().toISOString();
  const docRef = await db.collection("bookmarks").add({ lead, createdAt });

  const bookmark: Bookmark = {
    id: docRef.id,
    lead,
    createdAt,
  };

  return NextResponse.json({ bookmark }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Missing required field: id" },
      { status: 400 }
    );
  }

  await db.collection("bookmarks").doc(id).delete();

  return NextResponse.json({ success: true });
}
