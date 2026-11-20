import { ButtonType, DBTable, RouteChannel, SFC, userHC } from "../../../types";
import * as S from '../../../styles/Styles'
import { PageBreadCrumbs, EnhancedTable, CustomButton, Skeleton } from "../../../components";
import { useNavigate } from "react-router-dom";
import { useGetAllUsers } from "../../../hooks";
import AddIcon from '@mui/icons-material/Add';
import { Suspense, useMemo, useState } from "react";
import { countryFlag, countryName } from "../../../shared/data/countries";
import { countUsersByCountry, NOT_SET, UsersByCountry } from "./UsersByCountry";

export const AdminUserPage : SFC = ({ClassName}) => {
    const navigate = useNavigate()
    const links = [{ Text: 'Dashboard', OnClick: () => navigate(RouteChannel.DASHBOARD) }]
    const { records, refetch, loading } = useGetAllUsers()
    const [country, setCountry] = useState('')

    // Countries are about app users, so administrators aren't counted
    const appUsers = useMemo(() => (records ?? []).filter(u => u.AccountType !== 'administrator'), [records])
    const counts = useMemo(() => countUsersByCountry(appUsers), [appUsers])

    // The table shows the country as "flag + name" (so search and sorting use the name)
    const rows = useMemo(() => (records ?? [])
        .filter(u => !country || (country === NOT_SET ? !u.Country || !countryName(u.Country) : u.Country === country))
        .map(u => ({ ...u, Country: u.Country && countryName(u.Country) ? `${countryFlag(u.Country)} ${countryName(u.Country)}` : 'Not set' })),
    [records, country])

    const filterText = country === NOT_SET ? "Showing users who haven't set a country yet." : `Showing users from ${countryName(country)}.`

    return (
        <>
        <S.Container className={ClassName}>
            <S.PageTopBar className="breadcrumbs w-full  bg-white mb-2 rounded-md text-zinc-800 flex flex-col md:flex-row items-center justify-between p-2 md:h-[50px]">
                <S.Actions className="flex justify-between w-full items-center">
                    <PageBreadCrumbs Links={links} Active="Users"/>
                    <CustomButton  icon={<AddIcon className="md:text-white text-primary" />} onClick={()=>navigate(RouteChannel.NEW_USER)} text={'New'} type={ButtonType.button} />
                </S.Actions >
            </S.PageTopBar>
            {!loading && <UsersByCountry Counts={counts} Total={appUsers.length} Selected={country} OnSelect={setCountry} />}
            <S.Content className="flex mb-2 flex-col bg-white w-full h-fit rounded-md text-zinc-800 flex items-center px-3 py-2">
                <Suspense fallback={<Skeleton />}>
                    <EnhancedTable IsLoading={loading}
                        Title="Users"
                        Description={country ? `${filterText} Click "Show all countries" above to see everyone.` : "Everyone with an RTM account."}
                        Rows={rows} HeadCells={userHC} OnRecordDelete={()=>refetch()} RemoveTable={DBTable.USER} ClassName="md:max-h-[calc(100vh-156px)]"/>
                </Suspense>
            </S.Content>
        </S.Container>
        </>
    )
}
