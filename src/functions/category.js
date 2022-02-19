import axios from "axios";

export const getCategories = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/categories`);
};

export const getCategory = async (slug) => {
    return await axios.get(`${process.env.REACT_APP_API}/category/${slug}`);
};

export const removeCategory = async (slug, authtoken) => {
    return await axios.delete(`${process.env.REACT_APP_API}/category/${slug}` , {
        headers:{
            authtoken,
        }
    });
};

export const updateCategory = async (slug, category, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/category/${slug}` , category, {
        headers:{
            authtoken,
        }
    });
};

export const createCategory = async (category, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/category` , category, {
        headers:{
            authtoken,
        }
    });
};

export const getCategoriesSub = async (_id) => {
    return await axios.get(`${process.env.REACT_APP_API}/category/subcategory/${_id}`);
};

export const getCategoryById = async (_id) => {
    return await axios.get(`${process.env.REACT_APP_API}/categoryById/${_id}`);
};

