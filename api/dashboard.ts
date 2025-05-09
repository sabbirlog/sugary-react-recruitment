import clientManagementInstance from "./api";

export const getMaterials = async () => {
    const res = await clientManagementInstance().get('/Materials/GetAll/')

    return res?.data;
}