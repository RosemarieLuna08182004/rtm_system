import { useState, useEffect, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import * as S from './Styles';
import { RouteChannel } from '../../../types';
import { useNavigate } from 'react-router-dom';

const ADD_OPTIONS = [
    { label: 'New Volume', route: RouteChannel.NEW_CHAPTER },
    { label: 'New Term', route: RouteChannel.NEW_TERM },
    { label: 'New Sub Term', route: RouteChannel.NEW_TERM_LINE },
    { label: 'New Category', route: RouteChannel.NEW_CATEGORY },
];

export const AddNewDropDown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleItemClick = (route: string) => {
        setIsOpen(false);
        navigate(route);
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                type="button"
                aria-label="Add new"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                className="flex items-center justify-center w-14 h-8 rounded-lg bg-primary text-white shadow-md shadow-blue-600/30 transition-colors hover:bg-[#1534a8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
                <AddIcon fontSize="small" />
            </button>

            {isOpen && (
                <S.Dropdown role="menu">
                    {ADD_OPTIONS.map(({ label, route }) => (
                        <S.DropdownItem key={route} type="button" role="menuitem" onClick={() => handleItemClick(route)}>
                            <AddIcon fontSize="small" className="text-primary" />
                            <span>{label}</span>
                        </S.DropdownItem>
                    ))}
                </S.Dropdown>
            )}
        </div>
    );
};