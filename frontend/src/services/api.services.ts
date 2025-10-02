import axios from "@services/axios";

export const profile = async (body: any) => await axios.post("/profile", body);

export const createUser = async (body: any) =>
  await axios.post("/create-user", body);

export const updateProfile = async (body: any) =>
  await axios.put("/update-profile", body);
