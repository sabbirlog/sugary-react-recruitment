import clientManagementInstance from "./api";

export const userLogin = async (data: unknown) => {
    const res = await clientManagementInstance().post('/AdminAccount/Login', data)

    return res?.data;
}

export const refreshToken = async (data: unknown) => {
    const res = await clientManagementInstance().post('/Account/RefreshToken', data)

    return res?.data;
}