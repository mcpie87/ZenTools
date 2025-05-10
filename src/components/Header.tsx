import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="flex justify-between items-center py-4 border-b">
            <h1 className="text-2xl font-bold">ZenTools</h1>
            <DarkModeToggle />
            <nav className="space-x-4">
                {process.env.NODE_ENV === "development" && (
                    <>
                    </>
                )}
                <Button asChild>
                    <Link href="/inter-knot-level">
                        Inter-knot Level
                    </Link>
                </Button>
            </nav>
        </header >
    );
}