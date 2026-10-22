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
            <Breadcrumbs aria-label="breadcrumb" className="w-full md:w-4/6 mb-2 md:mb-0 items-center flex">
                {renderLinks()}
                <Typography className="text-primary">{Active}</Typography>
            </Breadcrumbs>
        </S.Container>
    );
};
