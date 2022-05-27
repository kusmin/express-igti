import AccountService from "../service/account.service.js";

async function createAccount(req, res, next) {
    try {
        let account = req.body;
        if (!account.balance || !account.name == null) {
            throw new Error("Name e balance são obrigatórios");
        }
        account = await AccountService.createAccount(account);
        res.send(account);
        logger.info(`POST /account - ${JSON.stringify(account)}`);
    } catch (err) {
        next(err);
    }
}

async function getAccounts(_req, res, next) {
    try {
        res.send(await AccountService.getAccounts());
        logger.info("GET /account");
    } catch (err) {
        next(err);
    }
}

async function getAccount(req, res, next) {
    try {
        res.send(await AccountService.getAccount(req.params.id));
        logger.info(`GET /account/id`);
    } catch (err) {
        next(err);
    }
}

async function deleteAccount(req, res, next) {
    try {
        AccountService.deleteAccount(req.params.id);
        res.end();
        logger.info(`DELETE /account/id - ${req.params.id}`);
    } catch (err) {
        next(err);
    }
}

async function editAccount(req, res, next) {
    try {
        const account = req.body;
        if (!account.id || !account.balance || !account.name == null) {
            throw new Error(" Id, name e balance são obrigatórios");
        }

        res.send(await AccountService.editAccount(account));
        logger.info(`PUT /account - ${JSON.stringify(account)}`);
    } catch (err) {
        next(err);
    }
}

async function patchAccount(req, res, next) {
    try {
        const account = req.body;
        if (!account.id || !account.name == null) {
            throw new Error("Id e balance são obrigatórios");
        }
        res.send(await AccountService.patchAccount(account));
        logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`);
    } catch (err) {
        next(err);
    }
}
export default {
    createAccount,
    getAccounts,
    getAccount,
    editAccount,
    deleteAccount,
    patchAccount,
};
