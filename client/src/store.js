import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};
function reducer(state, action) {
  switch (action.type) {
    case "ADD_PATIENT":
      const newPatient = action.payload;
      const existingPatient = state.userInfo.patients.find(
        (patient) => patient._id === newPatient._id
      );
      const updatedPatients = existingPatient
        ? state.userInfo.patients.map((patient) =>
            patient._id === existingPatient._id ? newPatient : patient
          )
        : [...state.userInfo.patients, newPatient];

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...state.userInfo,
          patients: updatedPatients,
        })
      );

      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          patients: updatedPatients,
        },
      };

    case "UPDATE_PATIENT":
      const updatedPatientId = action.payload._id;

      const updatedPatientIndex = state.userInfo.patients.findIndex(
        (patient) => patient._id === updatedPatientId
      );

      if (updatedPatientIndex !== -1) {
        const updatedPatientData = action.payload;

        const updatedPatient = {
          ...state.userInfo.patients[updatedPatientIndex],
          ...updatedPatientData,
        };

        const updatedUserInfo = {
          ...state.userInfo,
          patients: [
            ...state.userInfo.patients.slice(0, updatedPatientIndex),
            updatedPatient,
            ...state.userInfo.patients.slice(updatedPatientIndex + 1),
          ],
        };

        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

        return {
          ...state,
          userInfo: updatedUserInfo,
        };
      }

      return state;

    case "REMOVE_PATIENT":
      const removedPatientId = action.payload;
      const filteredPatients = state.userInfo.patients.filter(
        (patient) => patient._id !== removedPatientId
      );

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...state.userInfo,
          patients: filteredPatients,
        })
      );

      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          patients: filteredPatients,
        },
      };

    case "USER_SIGNIN": {
      return { ...state, userInfo: action.payload };
    }
    case "USER_SIGNOUT": {
      return {
        ...state,
        userInfo: null,
      };
    }

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
