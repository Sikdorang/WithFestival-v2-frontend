import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_ID = process.env.NOTION_DATABASE_ID;

const ALLOWED_TYPES = ["도입 문의", "가격 문의", "제휴", "기타"];

export async function POST(req: Request) {
  if (!process.env.NOTION_TOKEN || !DB_ID) {
    return NextResponse.json(
      { error: "서버 설정이 완료되지 않았습니다." },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const organization = String(body.organization ?? "").trim();
  const type = String(body.type ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "이름, 이메일, 메시지는 필수입니다." },
      { status: 400 }
    );
  }
  if (type && !ALLOWED_TYPES.includes(type)) {
    return NextResponse.json(
      { error: "허용되지 않은 문의 유형입니다." },
      { status: 400 }
    );
  }

  const properties: Record<string, unknown> = {
    이름: { title: [{ text: { content: name } }] },
    이메일: { email },
    메시지: { rich_text: [{ text: { content: message } }] },
    제출일: { date: { start: new Date().toISOString() } },
  };
  if (phone) properties["연락처"] = { phone_number: phone };
  if (organization)
    properties["소속/학교"] = {
      rich_text: [{ text: { content: organization } }],
    };
  if (type) properties["문의 유형"] = { select: { name: type } };

  try {
    await notion.pages.create({
      parent: { database_id: DB_ID },
      properties: properties as Parameters<
        typeof notion.pages.create
      >[0]["properties"],
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "알 수 없는 오류";
    console.error("[notion] create page failed:", msg);
    return NextResponse.json(
      { error: "문의 접수 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
