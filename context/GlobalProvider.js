import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/appwrite';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);



const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [User, setUser] = useState(null);
    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((res) => {//since it is a async function we need to use then block
                if (res) {
                    setisLoggedIn(true);
                    setUser(res);
                } else {
                    setisLoggedIn(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setisLoading(false);
            })
    }, [])


    return (
        <GlobalContext.Provider value={{//values that entrie app must have access to
            isLoggedIn,
            setisLoggedIn,
            User,
            setUser,
            isLoading,
        }}>
            {children}
        </GlobalContext.Provider>//to work it should actually wrap all screens to best to do so is use it in layout
    )
}

export default GlobalProvider;