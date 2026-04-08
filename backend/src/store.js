const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcryptjs");

const STORE_PATH = path.join(__dirname, "..", "data", "store.json");

async function readStore() {
  const raw = await fs.readFile(STORE_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeStore(nextData) {
  await fs.writeFile(STORE_PATH, JSON.stringify(nextData, null, 2), "utf-8");
}

async function ensureSecureUsers() {
  const store = await readStore();
  let changed = false;

  const users = (store.users || []).map((user) => {
    if (!user.passwordHash && user.password) {
      changed = true;
      return {
        ...user,
        passwordHash: bcrypt.hashSync(String(user.password), 10),
        password: undefined
      };
    }

    return user;
  });

  if (changed) {
    const sanitizedUsers = users.map((u) => {
      const next = { ...u };
      delete next.password;
      return next;
    });
    await writeStore({ ...store, users: sanitizedUsers });
  }
}

module.exports = {
  readStore,
  writeStore,
  ensureSecureUsers
};
