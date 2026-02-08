import { Navbar } from "@/components/layout/navbar";
import { BackgroundWrapper } from "@/components/backgrounds/background-wrapper";
import { CustomScrollbar } from "@/components/ui/custom-scrollbar";
import SplashCursor from "@/components/backgrounds/splash-cursor";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SplashCursor />
            <BackgroundWrapper />
            <Navbar />
            <CustomScrollbar />
            {children}
        </>
    );
}
