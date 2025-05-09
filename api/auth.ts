import clientManagementInstance from "./api";

export const userLogin = async (data: unknown) => {
    const res = await clientManagementInstance().post('/AdminAccount/Login', data)

    return res?.data;
}