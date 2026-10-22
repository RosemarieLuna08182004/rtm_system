import { useState, useEffect, useRef } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import * as S from './Styles';
import { ButtonType, SFC } from '../../../types';
import EditIcon from '@mui/icons-material/Edit';
import { twMerge } from 'tailwind-merge';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton } from '@mui/material';

interface OptionProps {
    EditOnClick: () => void
    DeleteOnClick: () => void
}

export const SubTermOption: SFC<OptionProps> = ({ClassName, EditOnClick, DeleteOnClick}) => {
    const [activeDropdown, setActiveDropdown] = useState<null | string>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setActiveDropdown(null);
    };

    useEffect(() => {
        if (activeDropdown) document.addEventListener('mousedown', handleClickOutside);
        else document.removeEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    return (
        <div className={twMerge("relative inline-block ", ClassName)} ref={dropdownRef}>
            <IconButton onClick={() => setActiveDropdown(activeDropdown === 'NewItem' ? null : 'NewItem')}  type={ButtonType.button}>
                <MoreHorizIcon className="text-primary" />
            </IconButton>
            {activeDropdown === 'NewItem' && (
                <S.Dropdown className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <S.DropdownItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center justify-start flex" onClick={EditOnClick}>
                        <EditIcon className="text-primary" /> <span className='ml-2'>Edit</span>
                    </S.DropdownItem>
                    <S.DropdownItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center justify-start flex" onClick={DeleteOnClick}>
                        <DeleteIcon className="text-primary" /> <span className='ml-2'>Delete</span>
                    </S.DropdownItem>
                </S.Dropdown>
            )}
        </div>
    );
};
