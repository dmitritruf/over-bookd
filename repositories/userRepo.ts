import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  BroadcastNotif,
  Transfer,
  Notification,
  FriendRequestData,
} from "~/utils/models/repo";
import { User } from "~/utils/models/repo";

const resource = "/user";

type Context = { $axios: NuxtAxiosInstance };

export default {
  getUser(context: Context, userId: string) {
    return context.$axios.get(`${resource}/${userId}`);
  },
  getAllUsers(context: Context) {
    return context.$axios.get(`${resource}`);
  },
  getAllUsernames(context: Context) {
    return context.$axios.get(`${resource}/all`);
  },
  broadcast(context: Context, data: BroadcastNotif) {
    return context.$axios.post(`${resource}/broadcast`, data);
  },
  transfer(context: Context, data: Transfer) {
    return context.$axios.post(`${resource}/transfer`, data);
  },
  addPP(context: Context, data: any) {
    return context.$axios.post(`${resource}/pp`, data);
  },
  updateNotifications(context: Context, userId: string, data: Notification[]) {
    return context.$axios.put(`${resource}/${userId}`, data);
  },
  updateUser(context: Context, userId: string, data: Partial<User>) {
    return context.$axios.put(`${resource}/${userId}`, data);
  },
  sendFriendRequest(context: Context, data: FriendRequestData) {
    return context.$axios.put(
      `${resource}/notification/${data.to.lastname}/${data.to.firstname}`,
      data.data
    );
  },
};
