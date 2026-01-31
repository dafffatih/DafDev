import { Navbar } from "@/components/layout/navbar";
import { BackgroundWrapper } from "@/components/backgrounds/background-wrapper";
import { CustomScrollbar } from "@/components/ui/custom-scrollbar";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <BackgroundWrapper />
            <Navbar />
            <CustomScrollbar />
            {children}
        </>
    );
}
