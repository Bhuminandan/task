import { OrganizationProfile } from "@clerk/nextjs";

const SettingsPage = () => {
    return (
        <div className="w-full">
            <OrganizationProfile
                appearance={{
                    elements: {
                        rootBox: {
                            boxShadow: "none",
                            width : "90%"
                        },
                        card: {
                            width: "100%",
                            border: "1px solid #e5e7eb",
                            boxShadow: "none",
                        }
                    }
                }}
            />
        </div>
    )
}

export default SettingsPage;