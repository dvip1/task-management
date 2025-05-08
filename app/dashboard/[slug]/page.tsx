"use client";

import Routes from "@/data/routes";
import { useEffect, use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const id = use(params);
  return <>{id.slug}</>;
}
