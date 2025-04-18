import {
    NoteText,
    HierarchySquare2,
    Category,
    LogoutCurve,
    Notification
} from "iconsax-react";
import { UploadCloud } from "lucide-react";

import { ReactNode } from "react";

export interface SubItem {
    label: string;
    color?: string;
    path: string;
    count?: number;
};

export interface MenuItem {
    label: string;
    icon?: ReactNode;
    path?: string;
    count?: number;
    subItems?: SubItem[];
};

export interface SidebarData {
    mainMenu: MenuItem[];
    adminMenu: MenuItem[];
    userMenu: MenuItem[];
    accountMenu: MenuItem[];
    unused: MenuItem[];
};

const sidebarData: SidebarData = {
    mainMenu: [],
    adminMenu: [
        {
            label: "Upload Template",
            icon: <UploadCloud size="20" color="#FF8A65" />,
            path: "/upload-template"
        },
        // {
        //     label: "Word Categories",
        //     icon: <Category size="20" color="#FF8A65" variant="Outline" />,
        //     path: "/word-categories"
        // },
        {
            label: "Keywords Collections",
            icon: <NoteText size="20" color="#FF8A65" variant="Outline" />,
            path: "/keywords-collections"
        },
        // {
        //     label: "Graphic Creator",
        //     icon: <HierarchySquare2 size="20" color="#FF8A65" variant="Outline" />,
        //     path: "/header-graphic-creator"
        // },
        
    ],
    userMenu: [
        {
            label: "Graphic Creator",
            icon: <HierarchySquare2 size="20" color="#FF8A65" variant="Outline" />,
            path: "/header-graphic-creator"
        },
        
    ],
    accountMenu: [
        {
            label: "Logout",
            icon: <LogoutCurve size="20" color="#FF8A65" variant="Outline" />,
            path: "/logout"
        }
    ],
    unused: [
        {
            label: "All Inboxes",
            icon: <Notification size="20" color="#FF8A65" variant="Outline" />,
            count: 20,
            subItems: [
                { label: "Primary", color: "blue", path: "/inboxes/primary" },
                { label: "Business", color: "red", path: "/inboxes/business" },
                { label: "Projects", color: "yellow", path: "/inboxes/projects", count: 20 },
                { label: "Game", color: "purple", path: "/inboxes/game" }
            ]
        },
        {
            label: "Logout",
            icon: <LogoutCurve size="20" color="#FF8A65" variant="Outline" />,
            path: "/logout"
        }
    ]
};

export default sidebarData;