import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { RootLayout } from './components';
import { Roles, RouteChannel } from './types';
import { PersistContext, RequireAuth } from './context';
import { AdminDashboardPage, AdminTermPage, AdminCategoryDetailsPage, AdminNewTermLinePage, AdminCategoryPage, AdminTermDetailsPage, AdminNewUserPage,AdminUserDetailsPage, AdminTermLineDetailsPage, AdminNotificationPage,AdminNewTermPage, AdminChapterDetailsPage, AdminChapterPage, AdminNewCategoryPage, AdminNewChapterPage, AdminTermLinePage, AdminUserPage, MissingPage, PageLogin, UnauthorizedPage, AdminTermPreviewPage, AdminProfilePage, AdminTermImportPage } from './pages';
import { PrivacyPolicyPage } from './pages/Admin/PrivacyPolicy';
import { TermsAndConditionsPage } from './pages/Admin/TermsAndConditions';
import { AdminLayout } from './containers';
import { AdminSettingsPage } from './pages/Admin/Settings';

export const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<RootLayout />}>
        <Route path={RouteChannel.INDEX} element={<PageLogin />} />
        <Route element={<PersistContext />}>
          <Route element={<RequireAuth allowedRoles={[Roles.admin]} />}>
            <Route element={<AdminLayout/>}>
              <Route path={RouteChannel.USER} element={<AdminUserPage/>} />
              <Route path={RouteChannel.NEW_USER} element={<AdminNewUserPage/>} />
              <Route path={RouteChannel.USER_DETAILS} element={<AdminUserDetailsPage/>} />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={[Roles.admin]} />}>
            <Route element={<AdminLayout/>}>
              <Route path={RouteChannel.DASHBOARD} element={<AdminDashboardPage/>} />
              <Route path={RouteChannel.SETTINGS} element={<AdminSettingsPage/>} />
              <Route path={RouteChannel.PROFIFLE} element={<AdminProfilePage/>} />
              <Route path={RouteChannel.CHAPTER} element={<AdminChapterPage/>} />
              <Route path={RouteChannel.NEW_CHAPTER} element={<AdminNewChapterPage/>} />
              <Route path={RouteChannel.CHAPTER_DETAILS} element={<AdminChapterDetailsPage/>} />
              <Route path={RouteChannel.TERM} element={<AdminTermPage/>} />
              <Route path={RouteChannel.NEW_TERM} element={<AdminNewTermPage/>} />
              <Route path={RouteChannel.TERM_DETAILS} element={<AdminTermDetailsPage/>} />
              <Route path={RouteChannel.TERM_PREVIEW} element={<AdminTermPreviewPage/>} />
              <Route path={RouteChannel.TERM_IMPORT} element={<AdminTermImportPage/>} />
              <Route path={RouteChannel.TERM_LINE} element={<AdminTermLinePage/>} />
              <Route path={RouteChannel.NEW_TERM_LINE} element={<AdminNewTermLinePage/>} />
              <Route path={RouteChannel.TERM_LINE_DETAILS} element={<AdminTermLineDetailsPage/>} />
              <Route path={RouteChannel.CATEGORY} element={<AdminCategoryPage/>} />
              <Route path={RouteChannel.NEW_CATEGORY} element={<AdminNewCategoryPage/>} />
              <Route path={RouteChannel.CATEGORY_DETAILS} element={<AdminCategoryDetailsPage/>} />
              <Route path={RouteChannel.NOTIFICATIONS} element={<AdminNotificationPage/>} />
              <Route path={RouteChannel.PRIVACY_POLICY} element={<PrivacyPolicyPage/>} />
              <Route path={RouteChannel.TERMS_AND_CONDITIONS} element={<TermsAndConditionsPage/>} />
            </Route>
          </Route>
        </Route>
        <Route path={RouteChannel.R403} element={<UnauthorizedPage/>} />
        <Route path={RouteChannel.R404}  element={<MissingPage/>} />
      </Route>
    </>
  )
);