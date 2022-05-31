import cors from "cors";
import express from "express";
import basicAuth from "express-basic-auth";
import { graphqlHTTP } from "express-graphql";
import {
    promises as fs
} from "fs";
import swaggerUi from "swagger-ui-express";
import winston from "winston";
import {
    swagger
} from "./doc.js";
import accountsRouter from "./routes/accounts.routes.js";
import Schema from "./schema/index.js";


const {
    readFile,
    writeFile
} = fs;

global.fileName = "accounts.json";

const {
    combine,
    timestamp,
    label,
    printf
} = winston.format;
const myFormat = printf(({
    level,
    message,
    label,
    timestamp
}) => {
    return `${timestamp} [${label}] ${level}: ${message}`
})

global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            filename: "my-bank-api.log"
        })
    ],
    format: combine(
        label({
            label: "my-bank-api"
        }),
        timestamp(),
        myFormat
    )
})

/**const schema = buildSchema(`
    type Account {
        id: Int
        name: String
        balance: Float
    }

    input AccountInput{
        id: Int
        name: String
        balance: Float
    }

    type Query {
        getAccounts: [Account]
        getAccount(id: Int): Account
    }

    type Mutation{
        createAccount(account: AccountInput): Account
        deleteAccount(id: Int): Boolean
        updateAccount(account: AccountInput): Account
    }
`);

const root = {
    getAccounts: () => accountService.getAccounts(),
    getAccount(args) {
        return accountService.getAccount(args.id);
    },

    createAccount({ account }) {
        return accountService.createAccount(account);
    },
    deleteAccount(args) {
        accountService.deleteAccount(args.id)
    },
    updateAccount({ account }) {
        return accountService.editAccount(account);
    }
}
**/

const app = express();
app.use(express.json());
app.use(cors())
app.use(express.static("public"));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swagger))

function getRole(username) {
    if (username == 'admin') {
        return 'admin';
    }
}

function authorize(...allowed) {
    return (req, res, next) => {

        const isAllowed = role => allowed.indexOf(role) > -1;

        if (req.auth.user) {
            const role = getRole(req.auth.user);

            if (isAllowed(role)) {
                next()
            } else {
                res.status(401).send('Role not allowed')
            }
        } else {
            res.status(403).send('User not found');
        }

    }
}


app.use(basicAuth({
    authorizer: (username, password) => {

        const userMath = basicAuth.safeCompare(username, 'admin')
        const pwdMath = basicAuth.safeCompare(password, 'admin')

        return userMath && pwdMath;
    }
}))



app.use("/account", authorize('admin', 'role'), accountsRouter);
app.use("/graphql", graphqlHTTP({
    schema: Schema,
    //rootValue: root,
    graphiql: true
}));

const newLocal = async () => {

    try {
        await readFile(fileName);
        logger.info("API Started!");
    } catch (err) {
        const initialJson = {
            nextId: 1,
            accounts: []
        };
        writeFile(fileName, JSON.stringify(initialJson)).then(() => {
            logger.info("API Started and File Created!");
        }).catch(erro => {
            logger.error(erro);
        });
    }
};
app.listen(3000, newLocal);