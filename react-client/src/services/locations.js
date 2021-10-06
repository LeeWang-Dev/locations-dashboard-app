import axios from "axios";
import { BASE_URL } from "../utils/constants.js";

export const getMarkers = async () => {
    var result = null;
    
    let url = `${BASE_URL}/api/markers/get`;
  
    await axios.get(url).then((response) => {
        result = response.data;
      }).catch((err) => {
        result = {
          status: "disconnected",
          message: "No internet connection",
        };
      });
    return result;
  };