import { useState } from "react";
import {
    AlertTriangle,
    Bell,
    CheckCheck,
    ChevronRight,
    CircleCheck,
    X,
} from "lucide-react";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../api/notifications";


function Topbar({ activeNav, setActiveNav, profile, settings }) {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadNotifications = async () => {
        try {
            setLoading(true);

            const data = await getNotifications();

            setNotifications(data);
            setUnread(data.filter(item => !item.read).length);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setLoading(false);
        }
    };
    async function markAllRead() {
        try {
            await markAllNotificationsAsRead();

            setNotifications((current) =>
                current.map((item) => ({ ...item, read: true }))
            );

            setUnread(0);
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    }

    async function openNotification(item) {
        try {
            if (!item.read) {
                await markNotificationAsRead(item.id);

                setNotifications((current) =>
                    current.map((notification) =>
                        notification.id === item.id
                            ? { ...notification, read: true }
                            : notification
                    )
                );

                setUnread((current) => Math.max(0, current - 1));
            }

            setActiveNav(
                item.type.startsWith("INCIDENT")
                    ? "Incidents"
                    : "Endpoints"
            );

            setOpen(false);
        } catch (error) {
            console.error("Failed to update notification:", error);
        }
    }

    return (
        <header className="topbar">
            <div className="breadcrumbs">
                <button
                    type="button"
                    className="breadcrumb-workspace"
                    onClick={() => setActiveNav("Overview")}
                >
                    Workspace
                </button>
                <span>/</span>
                <strong>{activeNav}</strong>
            </div>
            <div className="topbar-actions">
                <span className="environment"><span /> All systems monitored</span>
                <div className="notification-anchor">
                    <button type="button" className={`icon-button ${open ? "is-open" : ""}`} aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} aria-expanded={open} onClick={() => {
                        const nextOpen = !open;
                        setOpen(nextOpen);

                        if (nextOpen) {
                            loadNotifications();
                        }
                    }}>
                        <Bell size={19} />{settings?.unreadBadge !== false && unread > 0 && <i />}
                    </button>
                    {open && <section className="notification-popover" aria-label="Notifications">
                        <div className="notification-heading"><div><h2>Notifications</h2><p>{unread ? `${unread} new update${unread === 1 ? "" : "s"}` : "You’re all caught up"}</p></div><button type="button" className="notification-close" aria-label="Close notifications" onClick={() => setOpen(false)}><X size={16} /></button></div>
                        {notifications.length > 0 && unread > 0 && (
                            <button
                                type="button"
                                className="notification-mark-all"
                                onClick={markAllRead}
                            >
                                <CheckCheck size={16} />
                                Mark all as read
                            </button>
                        )}
                        <div className="notification-list">
                            {loading ? <div className="notification-empty">Checking for incident updates…</div> : notifications.length ? notifications.map((item) => <button type="button" className={`notification-item ${item.read ? "read" : ""}`} key={item.id} onClick={() => openNotification(item)}><span className={`notification-type ${item.type}`}>{item.type.startsWith("INCIDENT") ? <AlertTriangle size={16} /> : <CircleCheck size={16} />}</span><span className="notification-copy"><strong>{item.title}</strong><small>{item.message}</small><small className="notification-time">{item.createdAt}</small></span><ChevronRight size={15} className="notification-chevron" /></button>) : <div className="notification-empty"><CircleCheck size={22} /><strong>All clear</strong><span>Service alerts will show up here.</span></div>}
                        </div>
                        <button type="button" className="notification-footer" onClick={() => { setActiveNav("Incidents"); setOpen(false); }}>View incidents <ChevronRight size={14} /></button>
                    </section>}
                </div>
                <button type="button" className="topbar-avatar" aria-label="Open profile" title="My Profile" onClick={() => setActiveNav("Profile")}>{profile?.profileImageUrl ? <img src={profile.profileImageUrl} alt={profile.fullName || "Profile"} /> : profile?.fullName?.split(" ").map((name) => name[0]).join("").slice(0, 2).toUpperCase() || "IM"}</button>
            </div>
        </header>
    );
}

export default Topbar;
