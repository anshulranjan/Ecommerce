import axios from "axios";

export const getBrands = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/brand`);
};

export const getBrand = async (id) => {
    return await axios.get(`${process.env.REACT_APP_API}/brand/${id}`);
};

export const removeBrand = async (id, authtoken) => {
    return await axios.delete(`${process.env.REACT_APP_API}/brand/${id}` , {
        headers:{
            authtoken,
        }
    });
};

export const updateBrand = async (id, brand, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/brand/${id}` , brand, {
        headers:{
            authtoken,
        }
    });
};

export const createBrand = async (brand, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/brand` , brand, {
        headers:{
            authtoken,
        }
    });
};

