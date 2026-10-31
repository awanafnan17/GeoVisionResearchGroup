"use client";

import { useState, useCallback, useSyncExternalStore } from "react";

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";
const SIDEBAR_EVENT = "sidebar-storage-change";

function subscribeSidebar(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SIDEBAR_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SIDEBAR_EVENT, callback);
  };
}

function getSidebarSnapshot(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getSidebarServerSnapshot(): boolean {
  return false;
}

export function useSidebar() {
  const isCollapsed = useSyncExternalStore(
    subscribeSidebar,
    getSidebarSnapshot,
    getSidebarServerSnapshot
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = useCallback(() => {
    try {
      const current = localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(!current));
      window.dispatchEvent(new Event(SIDEBAR_EVENT));
    } catch {
      // localStorage unavailable
    }
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return { isCollapsed, isMobileOpen, toggleCollapse, toggleMobile, closeMobile };
}
