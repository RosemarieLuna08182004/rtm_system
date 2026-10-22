import { useState, useEffect, useRef } from 'react';
import { CircleButton } from "../../FormInputs";
import AddIcon from '@mui/icons-material/Add';
import * as S from './Styles';
import { ButtonType, RouteChannel } from '../../../types';
import { useNavigate } from 'react-router-dom';

export const AddNewDropDown = () => {
    const [activeDropdown, setActiveDropdown] = useState<null | string>(null);
    const navigate = useNavigate();
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

    const handleItemClick = (route: string) => {
        setActiveDropdown(null); 
        navigate(route);
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <CircleButton OnClick={() => setActiveDropdown(activeDropdown === 'NewItem' ? null : 'NewItem')} IsNotification={false} Icon={<AddIcon className="text-primary" />}  Type={ButtonType.button}/>

            {activeDropdown === 'NewItem' && (
                <S.Dropdown className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <S.DropdownItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center justify-start flex" onClick={() => handleItemClick(RouteChannel.NEW_CHAPTER)}>
                        <AddIcon className="text-primary" /> <span>New Volume</span>
                    </S.DropdownItem>
                    <S.DropdownItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center justify-start flex" onClick={() => handleItemClick(RouteChannel.NEW_TERM)}>
                        <AddIcon className="text-primary" /> <span>New Term</span>
                    </S.DropdownItem>
                    <S.DropdownItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center justify-start flex" onClick={() => handleItemClick(RouteChannel.NEW_TERM_LINE)}>
                        <AddIcon className="text-primary" /> <span>New Sub Term</span>
                    </S.DropdownItem>
                    <S.DropdownItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center justify-start flex" onClick={() => handleItemClick(RouteChannel.NEW_CATEGORY)}>
                        <AddIcon className="text-primary" /> <span>New Category</span>
                    </S.DropdownItem>
                    <S.DropdownItem className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center justify-start flex" onClick={() => handleItemClick(RouteChannel.NEW_PRODUCT)}>
                        <AddIcon className="text-primary" /> <span>New Product</span>
                    </S.DropdownItem>
                </S.Dropdown>
            )}
        </div>
    );
};
