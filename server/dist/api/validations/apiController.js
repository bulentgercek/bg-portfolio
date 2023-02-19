"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiController = void 0;
const connections_1 = require("../../connections");
var ApiController;
(function (ApiController) {
    /**
     * Context Object Initializer
     * @param ctxObj Context Object
     * @returns CtxObj<T>
     */
    function initContext(ctxObj) {
        return ctxObj;
    }
    ApiController.initContext = initContext;
    /**
     * Async Validation function for Zod Input
     * @param ctxObj Context Object
     * @returns Promise<ValidateResults<T>>
     */
    async function inputValidate(ctxObj) {
        const validated = await ctxObj.zInput.safeParseAsync(ctxObj.reqData);
        return Promise.resolve({
            success: validated.success,
            result: validated.success ? validated.data : validated.error,
        });
    }
    ApiController.inputValidate = inputValidate;
    /**
     * Async Caller for TypeORM Manager findOne function
     * @param entityClass TypeORM Entity
     * @param options TypeORM Options (relations etc.)
     * @param validateResults Output of inputValidate() function)
     * @returns Promise<Entity | null
     */
    async function findOne(entityClass, options, validateResults) {
        if (!validateResults.success)
            return validateResults;
        const dbResult = await connections_1.dsm.findOne(entityClass, options).catch((e) => e);
        return dbResult;
    }
    ApiController.findOne = findOne;
    /**
     * Async Caller for TypeORM Manager find function
     * @param entityClass TypeORM Entity
     * @param options TypeORM Options (relations etc.)
     * @returns Promise<Entity[]>
     */
    async function find(entityClass, options) {
        const dbResult = await connections_1.dsm.find(entityClass, options).catch((e) => e);
        return dbResult;
    }
    ApiController.find = find;
})(ApiController = exports.ApiController || (exports.ApiController = {}));
