import axios from "axios";
import { BASE_URL } from "../utils/settings.js";

export const getPlaces = async () => {
    var result = null;
      
    let url = `${BASE_URL}/api/places`;
  
    await axios.get(url).then((response) => {
        result = response.data;
    }).catch((err) => {
      result = {
        status: "failed",
        message: "No internet connection",
      };
    });
    return result;
}

export const addPlace = async (params) => {
    var result = null;
      
    let url = `${BASE_URL}/api/place/add`;
  
    await axios.post(url, params).then((response) => {
        result = response.data;
    }).catch((err) => {
      result = {
        status: "failed",
        message: "No internet connection",
      };
    });
    return result;
}

export const deletePlace = async (params) => {
    var result = null;
      
    let url = `${BASE_URL}/api/place/delete`;
  
    await axios.post(url, params).then((response) => {
        result = response.data;
    }).catch((err) => {
      result = {
        status: "failed",
        message: "No internet connection",
      };
    });
    return result;
}