import { Navbar } from "@/app/(marketing)/_components/navbar";

const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full bg-slate-100 flex items-center justify-center">
            <Navbar />
            {children}
        </div>
    );
};

export default ClerkLayout