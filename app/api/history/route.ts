import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { SearchHistoryEntry } from "@/types";

export async function GET() {
  const snapshot = await db
    .collection("searchHistory")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  const history: SearchHistoryEntry[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as SearchHistoryEntry[];

  return NextResponse.json({ history });
}

export async function DELETE() {
  const snapshot = await db.collection("searchHistory").get();

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  return NextResponse.json({ success: true });
}
