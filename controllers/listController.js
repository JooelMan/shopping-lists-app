import * as listService from "../services/listService.js";
import { renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

const viewList = async (request) => {
  const url = new URL(request.url);
  const urlParts = url.pathname.split("/");
  const data = {
    list: await listService.findListByID(urlParts[2]),
    items: await listService.findItemsByListID(urlParts[2]), // not collected items
    collectedItems: await listService.findCollectedItemsByListID(urlParts[2]),
  };

  return new Response(await renderFile("list.eta", data), responseDetails);
};

const viewLists = async (request) => {
  const data = {
    lists: await listService.findAllActiveLists(),
  };

  return new Response(await renderFile("lists.eta", data), responseDetails);
};

const addList = async (request) => {
  const formData = await request.formData();
  const name = formData.get("name");
  await listService.createList(name);

  return redirectTo("/lists");
};

const addItem = async (request) => {
  const url = new URL(request.url);
  const urlParts = url.pathname.split("/");
  const formData = await request.formData();
  const name = formData.get("name");

  await listService.createItem(name, urlParts[2]);

  return redirectTo(`/lists/${urlParts[2]}`);
};

const collectItem = async (request) => {
  const url = new URL(request.url);
  const urlParts = url.pathname.split("/");
  await listService.collectItem(urlParts[4]);

  return redirectTo(`/lists/${urlParts[2]}`);
};

const deactivateList = async (request) => {
  const url = new URL(request.url);
  const urlParts = url.pathname.split("/");
  await listService.deactivateListByID(urlParts[2]);
  return redirectTo("/lists");
};

const viewMainPage = async (request) => {
  const data = {
    listCount: await listService.countLists(),
    itemCount: await listService.countItems(),
  };
  return new Response(await renderFile("mainpage.eta", data), responseDetails);
};

export {
  addItem,
  addList,
  collectItem,
  deactivateList,
  redirectTo,
  viewList,
  viewLists,
  viewMainPage,
};
