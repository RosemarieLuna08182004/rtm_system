import { SFC } from "../../../types";
import { Outlet } from "react-router-dom";
import { useAuth, useSignOut, useToggle } from "../../../hooks";
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { SessionExpiredModal } from "../../../modals";
import * as S from '../../../styles';
import { ipx } from "../../FormInputs";
import { date } from "../../../constants";

export const RootLayout: SFC = () => {
  const { reSignOut } = useSignOut();
  const [modalIsOpen, toggleModal] = useToggle(false);
  const { auth } = useAuth();
  const xp = ipx(new Date(date ?? ""));

  const confirm = () => {
    toggleModal();
    reSignOut();
  };

  useEffect(() => {
    const handleTokenExpiration = () => {
      // The manual token expiration check was overriding the axios interceptor logic.
      // We've disabled this manual check to allow the useAxiosPrivate interceptor 
      // to handle refreshes properly before showing a session expired modal.
      /*
      if (auth?.user && auth.accessToken && isTokenExpired(auth.accessToken)) {
        localStorage.removeItem("auth");
        if (!hasModalOpened) toggleModal();
        setHasModalOpened(true);
      }
      */
    };

    handleTokenExpiration();
    const intervalId = setInterval(() => {
      handleTokenExpiration();
    }, 5 * 6 * 1000);

    return () => clearInterval(intervalId);
  }, [auth.accessToken, auth?.user, toggleModal]);

  const renderMods = () => {
    if (xp.spx) return null;
    return null;
  };

  const renderModal = () => {
    if (!modalIsOpen) return null;
    return (
      <SessionExpiredModal
        ClassName='md:w-2/6 w-11/12'
        close={toggleModal}
        title="Session Expired"
        confirm={confirm}
      />
    );
  };

  return (
    <>
      <S.Layout className="">
        <Outlet />
      </S.Layout>
      <ToastContainer
        autoClose={3000}
        closeOnClick
        draggable
        hideProgressBar
        newestOnTop
        pauseOnFocusLoss
        pauseOnHover
        position="bottom-left"
        rtl={false}
        transition={Bounce}
      />
      {renderMods()}
      {renderModal()}
    </>
  );
};
