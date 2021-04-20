import { useCallback, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NewLibraryModal from "../../Modals/NewLibrary/Index";

import { fetchLibraries, handleWsNewLibrary, handleWsDelLibrary } from "../../actions/library.js";

function Libraries() {
  const dispatch = useDispatch();

  const { auth, libraries } = useSelector(store => ({
    auth: store.auth,
    libraries: store.library.fetch_libraries
  }));

  const handle_ws_msg = useCallback(async ({data}) => {
    const payload = JSON.parse(data);

    switch(payload.type) {
      case "EventRemoveLibrary":
        dispatch(handleWsDelLibrary(payload.id));
        break;
      case "EventNewLibrary":
        dispatch(handleWsNewLibrary(auth.token, payload.id));
        break;
      default:
        break;
    }
  }, [auth.token, dispatch]);

  useEffect(() => {
    const library_ws = new WebSocket(`ws://${window.host}:3012/events/library`);

    if (window.location.protocol !== "https:") {
      library_ws.addEventListener("message", handle_ws_msg);
    }

    dispatch(fetchLibraries(auth.token));

    return () => {
      library_ws.removeEventListener("message", handle_ws_msg);
      library_ws.close();
    };
  }, [auth.token, dispatch, handle_ws_msg]);

  let libs;

  const { fetched, error, items } = libraries;

  // FETCH_LIBRARIES_OK
  if (fetched && !error && items.length > 0) {
    libs = items.map((
      { name, id, media_type }, i
    ) => (
      <NavLink
        to={"/library/" + id}
        className="item" key={i}
      >
        {media_type === "movie" && <FontAwesomeIcon icon="film"/>}
        {media_type === "tv" && <FontAwesomeIcon icon="tv"/>}
        <p>{name}</p>
      </NavLink>
    ))
  }

  return (
    <section className="libraries">
      <header>
        <h4>Libraries</h4>
        <NewLibraryModal>
          <button className="openNewLibrary">
            +
          </button>
        </NewLibraryModal>
      </header>
      <div className="list">
        <NavLink className="item" to="/" exact>
          <FontAwesomeIcon icon="home"/>
          <p>Dashboard</p>
        </NavLink>
        {libs}
      </div>
    </section>
  );
}

export default Libraries;
