import { Toolbar } from "@mui/material";
import { SFC, TableToolbarProps } from "../../../../types";
import * as S from '../../../../styles'
import { SectionHeader } from "../../../SectionHeader";

export const TableToolbar: SFC<TableToolbarProps> = ({ Title, Description, Count, Total, children }) => {
  // "2,861" normally; "12 of 2,861" while a search narrows the list
  const badge = Count === undefined ? undefined
    : Total !== undefined && Total !== Count ? `${Count.toLocaleString()} of ${Total.toLocaleString()}`
    : Count.toLocaleString();
  return (
        <>
        <Toolbar sx={{ marginBottom:'10px', padding: '0px !important', textAlign: 'left', width: '100%', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center',justifyContent: 'space-between', }}>
            <S.Container className="w-full flex flex-col md:flex-row md:items-center gap-3 py-2">
                <S.Divider className="w-full md:w-1/2">
                    <SectionHeader Title={Title} Description={Description} Badge={badge} Id="tableTitle" />
                </S.Divider>
                <S.Divider className="w-full flex justify-end md:w-1/2">
                    {children}
                </S.Divider>
            </S.Container>
        </Toolbar>
        </>
    )
}
