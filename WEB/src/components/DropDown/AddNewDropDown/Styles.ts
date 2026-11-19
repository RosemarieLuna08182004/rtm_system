import styled from 'styled-components';

export const Dropdown = styled.div`
    position: absolute;
    right: 0;
    margin-top: 0.5rem;
    width: 12.5rem;
    padding: 0.375rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    box-shadow: 0 12px 28px rgba(15, 42, 107, 0.14);
    z-index: 50;
`;

export const DropdownItem = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 0;
    border-radius: 0.5rem;
    background: transparent;
    cursor: pointer;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e3a8a;

    &:hover,
    &:focus-visible {
        background-color: #eff6ff;
        outline: none;
    }
`;