'use client';

import AIDirectoryClient from "@/components/AIDirectoryClient";
import { Suspense } from "react";

export default function AIToolsPage() {
    return (
        <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-10">Loading...</div>}>
            <AIDirectoryClient />
        </Suspense>
    );
}