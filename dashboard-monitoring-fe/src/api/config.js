const URL_SYSTEM_V1 = "http://localhost:5050/api/v1";
const URL = {
  URL_GET_ALL_SERVICE: URL_SYSTEM_V1 + "/service/get-all-service",
  URL_ADD_NEW_SERVICE: URL_SYSTEM_V1 + "/service/add-new-service",
  URL_GET_SERVICE_TREE: URL_SYSTEM_V1 + "/service/get-service-tree",
  URL_GET_SERVICE_TREE_REVERSE:
    URL_SYSTEM_V1 + "/service/get-service-tree-reverse",
  URL_GET_SERVICE_LIST: URL_SYSTEM_V1 + "/service/get-service-list",
  URL_GET_SERVICE: URL_SYSTEM_V1 + "/service/get-service/", // + id
  URL_EDIT_SERVICE: URL_SYSTEM_V1 + "/service/edit-service/",
  URL_DELETE_SERVICE: URL_SYSTEM_V1 + "/service/delete-service/",
  URL_GET_ALL_EMAIL: URL_SYSTEM_V1 + "/user/get-all-user",
  URL_ADMIN_LOGIN: URL_SYSTEM_V1 + "/user/login",
  URL_ADMIN_REFRESH: URL_SYSTEM_V1 + "/user/refresh",
  URL_GET_TREE_D3: URL_SYSTEM_V1 + "/service/get-tree/",
};

export default URL;
