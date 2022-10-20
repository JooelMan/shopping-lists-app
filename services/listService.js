import { executeQuery } from "../database/database.js";

const findAllActiveLists = async () => {
  const result = await executeQuery(
    "SELECT * FROM shopping_lists WHERE active = TRUE;",
  );
  return result.rows;
};

const findItemsByListID = async (id) => {
  const result = await executeQuery(
    "SELECT * FROM shopping_list_items WHERE shopping_list_id = $id AND collected = FALSE ORDER BY name;",
    { id: id },
  );
  return result.rows;
};

const findCollectedItemsByListID = async (id) => {
  const result = await executeQuery(
    "SELECT * FROM shopping_list_items WHERE shopping_list_id = $id AND collected = TRUE ORDER BY name;",
    { id: id },
  );
  return result.rows;
};

const findListByID = async (id) => {
  const result = await executeQuery(
    "SELECT * FROM shopping_lists WHERE id = $id;",
    {
      id: id,
    },
  );
  if (result.rows && result.rows.length > 0) {
    return result.rows[0];
  }
  return { id: 0, name: "Unknown" };
};

const deactivateListByID = async (id) => {
  await executeQuery(
    "UPDATE shopping_lists SET active = FALSE WHERE id = $id;",
    {
      id: id,
    },
  );
};

const createList = async (name) => {
  await executeQuery(
    "INSERT INTO shopping_lists (name) VALUES ($name);",
    {
      name: name,
    },
  );
};

const createItem = async (name, listID) => {
  await executeQuery(
    "INSERT INTO shopping_list_items(shopping_list_id, name) VALUES ($listID, $name);",
    {
      name: name,
      listID: listID,
    },
  );
};

const collectItem = async (id) => {
  await executeQuery(
    "UPDATE shopping_list_items SET collected = TRUE WHERE id = $id;",
    {
      id: id,
    },
  );
};

const countLists = async () => {
  const result = await executeQuery("SELECT COUNT(*) FROM shopping_lists;");
  if (result.rows && result.rows.length > 0) {
    return result.rows[0].count;
  }
  return 0;
};

const countItems = async () => {
  const result = await executeQuery(
    "SELECT COUNT(*) FROM shopping_list_items;",
  );
  if (result.rows && result.rows.length > 0) {
    return result.rows[0].count;
  }
  return 0;
};

export {
  collectItem,
  countItems,
  countLists,
  createItem,
  createList,
  deactivateListByID,
  findAllActiveLists,
  findCollectedItemsByListID,
  findItemsByListID,
  findListByID,
};
