import express from "express";
import AccountController from "../controller/account.controller.js";


const router = express.Router();

router.post("/", AccountController.createAccount);

router.get("/", AccountController.getAccounts)

router.get("/:id", AccountController.getAccount)

router.delete("/:id", AccountController.deleteAccount)

router.put("/", AccountController.editAccount);

router.patch("/updateBalance", AccountController.patchAccount);

router.use((err, req, res, _next) => {
    global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    res.status(400).send({
        error: err.message
    })
})

export default router;