import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

async function getAccounts() {
    const jsonData = JSON.parse(await readFile(fileName));
    return jsonData.getAccounts;
}

async function insertAccount(account) {
    const jsonData = JSON.parse(await readFile(fileName));

    account = {
        id: jsonData.nextId++,
        name: account.name,
        balance: account.balance,
    };
    jsonData.accounts.push(account);

    await writeFile(fileName, JSON.stringify(jsonData, null, 2));

    return account;
}

async function getAccount(id) {
    const accounts = await getAccounts();
    const account = accounts.find((acount) => acount.id === parseInt(id));
    if (account) {
        return account;
    } else {
        throw new Error("Registro não encontrado.");
    }
}

async function deleteAccount(id) {
    const jsonData = JSON.parse(await readFile(global.fileName));
    jsonData.accounts = jsonData.accounts.filter(
        (acount) => acount.id !== parseInt(id)
    );
    await writeFile(global.fileName, JSON.stringify(jsonData, null, 2));
}

async function updateAccount(account) {
    const jsonData = JSON.parse(await readFile(global.fileName));
    const index = jsonData.accounts.findIndex(
        (a) => a.id === parseInt(account.id)
    );

    if (index === -1) {
        throw new Error("Registro não encontrado.");
    }

    jsonData.accounts[index].name = account.name;
    jsonData.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(jsonData, null, 2));

    return jsonData.accounts[index];
}

async function patchAccount(account) {
    const jsonData = JSON.parse(await readFile(global.fileName));
    const index = jsonData.accounts.findIndex(
        (a) => a.id === parseInt(account.id)
    );

    if (index === -1) {
        throw new Error("Registro não encontrado.");
    }
    jsonData.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(jsonData, null, 2));

    return jsonData.accounts[index];
}

export default {
    getAccounts, insertAccount, getAccount, deleteAccount, updateAccount, patchAccount
}