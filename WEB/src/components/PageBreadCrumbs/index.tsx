import { Breadcrumbs, Link, Typography } from "@mui/material";
import { PageBreadCrumbsProps, SFC } from "../../types";
import { twMerge } from "tailwind-merge";
import * as S from '../../styles'

export const PageBreadCrumbs: SFC<PageBreadCrumbsProps> = ({ClassName, Links=[], Active}) => {
    const renderLinks = () => {
        return Links.map((link, index) => (
            <Link  key={index} underline="hover" color="inherit" onClick={link.OnClick} sx={{ cursor: link.OnClick ? "pointer" : "default" }}>
                {link.Text}
            </Link>
        ));
    };

    return (
        <S.Container className={twMerge('w-full flex flex-row', ClassName)}>
            <Breadcrumbs aria-label="breadcrumb" className="w-full md:w-4/6 mb-2 md:mb-0 items-center flex" sx={{ fontSize: '13px', fontStyle: 'italic' }}>
                {renderLinks()}
                {/* Typography sets its own size, so inherit the 13px italic from Breadcrumbs */}
                <Typography className="text-primary" sx={{ fontSize: 'inherit', fontStyle: 'inherit' }}>{Active}</Typography>
            </Breadcrumbs>
        </S.Container>
    );
};
