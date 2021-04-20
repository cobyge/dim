import { useCallback } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { delLibrary } from "../../../actions/library";
import ConfirmationBox from "../../../Modals/ConfirmationBox";

const Delete = (props) => {
  const dispatch = useDispatch();

  const { auth, del_library } = useSelector(store => ({
    auth: store.auth,
    del_library: store.library.del_library
  }));

  const history = useHistory();

  const removeLib = useCallback(async () => {
    if (del_library.deleting) return;

    await dispatch(delLibrary(auth.token, props.id));

    // redirect to dashboard when removed
    history.push("/");
  }, [auth.token, del_library.deleting, dispatch, history, props.id]);

  const { deleting } = del_library;

  return (
    <div className="deleteLibraryAction">
      <ConfirmationBox
        title="Confirm action"
        cancelText="Nevermind"
        confirmText="Yes"
        action={removeLib}
        msg="Are you sure you want to remove this library?"
      >
        <button className={`deleting-${deleting}`}>Remove library</button>
      </ConfirmationBox>
    </div>
  )
};

export default Delete;
