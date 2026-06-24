"use client";

import { useEffect } from "react";

export function usePreparingSpace(onFinish: () => void) {
  useEffect(() => { const timeout = window.setTimeout(onFinish, 1500); return () => window.clearTimeout(timeout); }, [onFinish]);
}
