import {useEffect,useState} from "react";
import { Alert } from "react-native";


const useAppwrite = (fn) =>{
    
const [data, setData] = useState([]);
const [isLoading, setisLoading] = useState(true)

 const fetchData = async () => {
    setisLoading(true);
    try{
      const response = await fn();
      setData(response);
    }
    catch(error){
      console.log(error)
      Alert.alert('Error', 'An error occured while fetching data')
    }
    finally{
      setisLoading(false)
    }
  }

useEffect(() => {
 
  fetchData();//calling once at start
}, []);

const refetch=()=>fetchData();//calling everytime the refetch function is called.


return {data,isLoading,refetch}
}

export default useAppwrite
