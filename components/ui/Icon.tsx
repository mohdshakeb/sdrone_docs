import React from 'react';
import {
    RiInbox2Fill,
    RiArchiveDrawerFill,
    RiAlertFill,
    RiBarChart2Fill,
    RiSettings4Fill,
    RiAddFill,
    RiArrowDownSLine,
    RiSunFill,
    RiMoonFill,
    RiHistoryFill,
    RiFireFill,
    RiCloseLine,
    RiUser3Line,
    RiSurveyFill,
    RiFirstAidKitFill,
    RiMenuLine,
} from 'react-icons/ri';

export type IconName =
    | 'inbox'
    | 'archive'
    | 'alert'
    | 'chart'
    | 'settings'
    | 'add'
    | 'arrow-down'
    | 'sun'
    | 'moon'
    | 'history'
    | 'fire'
    | 'close'
    | 'user'
    | 'survey'
    | 'first-aid'
    | 'menu'
    | 'sos';

export type IconSize = 16 | 20 | 24 | 32;

const SosIcon = ({ size, color, className }: { size?: number | string; color?: string; className?: string }) => (
    <img
        src="/SOS.svg"
        alt="SOS"
        style={{
            width: size,
            height: size,
            display: 'block'
        }}
        className={className}
    />
);

interface IconProps extends React.SVGAttributes<SVGElement> {
    name: IconName;
    size?: IconSize;
    color?: string; // Optional, defaults to currentColor
}

const ICON_MAP: Record<IconName, React.ComponentType<{ size?: number | string; color?: string; className?: string }>> = {
    'inbox': RiInbox2Fill,
    'archive': RiArchiveDrawerFill,
    'alert': RiAlertFill,
    'chart': RiBarChart2Fill,
    'settings': RiSettings4Fill,
    'add': RiAddFill,
    'arrow-down': RiArrowDownSLine,
    'sun': RiSunFill,
    'moon': RiMoonFill,
    'history': RiHistoryFill,
    'fire': RiFireFill,
    'close': RiCloseLine,
    'user': RiUser3Line,
    'survey': RiSurveyFill,
    'first-aid': RiFirstAidKitFill,
    'menu': RiMenuLine,
    'sos': SosIcon,
};

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = '', ...props }) => {
    const IconComponent = ICON_MAP[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in Icon System.`);
        return null;
    }

    return (
        <IconComponent
            size={size}
            className={className}
            {...props}
        />
    );
};

export default Icon;
