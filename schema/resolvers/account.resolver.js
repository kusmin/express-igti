import AccountsRepository from "../../repository/account.repository.js";


async function createAccount(account) {
    return AccountsRepository.insertAccount(account);
}

async function getAccounts() {
    return AccountsRepository.getAccounts();
}

async function getAccount(id) {
    return AccountsRepository.getAccount(id);
}

async function deleteAccount(id) {
    AccountsRepository.deleteAccount(id);
}

async function editAccount(account) {
    return AccountsRepository.updateAccount(account);
}

async function patchAccount(account) {
    const acc = await AccountsRepository.getAccount(account.id);
    acc.balance = account.balance;
    return AccountsRepository.updateAccount(acc);
}

export default {
    createAccount,
    getAccounts,
    getAccount,
    deleteAccount,
    editAccount,
    patchAccount,
};
