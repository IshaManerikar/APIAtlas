
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/profile";
import "./Profile.css";

const emptyProfile = {
    fullName: "",
    email: "",
    jobTitle: "",
    department: "",
    phoneNumber: "",
    profileImageUrl: "",
};

export default function ProfilePanel() {
    const [profile, setProfile] = useState(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        getProfile()
            .then((data) => setProfile({ ...emptyProfile, ...data }))
            .catch(() => setError("Failed to load profile. Check the backend."))
            .finally(() => setLoading(false));
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setProfile((current) => ({ ...current, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const updatedProfile = await updateProfile(profile);
            setProfile({ ...emptyProfile, ...updatedProfile });
            setMessage("Profile updated successfully.");
        } catch {
            setError("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p>Loading profile...</p>;

    const fields = [
        { name: "fullName", label: "Full Name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "jobTitle", label: "Job Title" },
        { name: "department", label: "Department" },
        { name: "phoneNumber", label: "Phone Number", type: "tel" },
        { name: "profileImageUrl", label: "Profile Image URL" },
    ];

    return (
        <section className="profile-panel">
            <div className="profile-panel-heading">
                <div>
                    <h2>My Profile</h2>
                    <p>Manage your personal information.</p>
                </div>
                <div className="profile-avatar">
                    {profile.profileImageUrl ? (
                        <img src={profile.profileImageUrl} alt="Profile" />
                    ) : (
                        profile.fullName?.charAt(0)?.toUpperCase() || "U"
                    )}
                </div>
            </div>

            {message && <p role="status">{message}</p>}
            {error && <p role="alert">{error}</p>}

            <form onSubmit={handleSubmit} className="profile-form">
                {fields.map((field) => (
                    <div className="profile-field" key={field.name}>
                        <label htmlFor={field.name}>{field.label}</label>
                        <input
                            id={field.name}
                            name={field.name}
                            type={field.type || "text"}
                            value={profile[field.name] || ""}
                            onChange={handleChange}
                            required={field.required || false}
                        />
                    </div>
                ))}

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </section>
    );
}
