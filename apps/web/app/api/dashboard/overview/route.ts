import { NextResponse } from "next/server";
import { dashboardStub } from "../../../dashboardStub";

export async function GET() {
  return NextResponse.json(dashboardStub);
}