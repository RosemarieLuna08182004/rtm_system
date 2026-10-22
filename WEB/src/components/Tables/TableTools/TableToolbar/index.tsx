import { Toolbar, Typography } from "@mui/material";
import { SFC, TableToolbarProps } from "../../../../types";
import * as S from '../../../../styles'

export const TableToolbar: SFC<TableToolbarProps> = ({ Title, children }) => {
  return (
        <>
        <Toolbar sx={{ marginBottom:'10px', padding: '0px !important', textAlign: 'left', width: '100%', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center',justifyContent: 'space-between', }}>
            <S.Container className="w-full flex flex-col md:flex-row">
                <S.Divider className=" mb-2 w-full md: w-1/2">
                    <Typography sx={{ minWidth:'300px', maxWidth:'100%', flex: '1 1 100%', fontSize: { xs: '1rem', md: '1.25rem' },}} variant="h6" id="tableTitle" component="div" > {Title} </Typography>
                </S.Divider>
                <S.Divider className="mt-2 md:mt-0 w-full flex justify-end md:w-1/2">
                    {children}
                </S.Divider>
            </S.Container>
        </Toolbar>
        </>
    )
}