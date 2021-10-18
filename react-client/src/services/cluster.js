import axios from "axios";
import { BASE_URL } from "../utils/settings.js";

export const getClusters = async (params) => {
    var result = null;
    
    let url = `${BASE_URL}/api/clusters`;
  
    await axios.post(url, params).then((response) => {
        result = response.data;
    }).catch((err) => {
      result = {
        status: "failed",
        message: "No internet connection",
      };
    });
    return result;
  };