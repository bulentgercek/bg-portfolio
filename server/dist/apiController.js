"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiController = void 0;
const connections_1 = require("./connections");
var ApiController;
(function (ApiController) {
    /**
     * Context Object Initializer
     * @param ctxObj Context Object
     * @returns CtxObj<TParams, TBody>
     */
    function initContext(ctxObj) {
        return ctxObj;
    }
    ApiController.initContext = initContext;
    /**
     * Async Validation function for Zod Input
     * @param ctxObj Context Object
     * @returns Promise<ValidateResults<TParams, TBody>>
     */
    async function inputValidate(ctxObj) {
        // Create success and result properties
        const validatedFinal = {
            success: {},
            result: {},
        };
        // if ctxObj not given so return true
        if (!ctxObj) {
            validatedFinal.success.params = true;
            validatedFinal.result.body = true;
            return Promise.resolve(validatedFinal);
        }
        // Check the input vs params and input vs body for throwing error
        if (ctxObj.zInput.params && !ctxObj.reqData.params) {
            console.error("ERROR: Params defined for Zod but no params found in reqData. Check initContext definition.");
            process.exit(1);
        }
        if (ctxObj.zInput.body && !ctxObj.reqData.body) {
            console.error("ERROR: Body defined for Zod but no body found in reqData. Check initContext definition.");
            process.exit(1);
        }
        // Create and
        if (ctxObj.zInput.params) {
            const validated = await ctxObj.zInput.params.safeParseAsync(ctxObj.reqData.params);
            validatedFinal.success.params = validated.success;
            validatedFinal.result.params = validated.success
                ? validated.data
                : validated.error;
        }
        if (ctxObj.zInput.body) {
            const validated = await ctxObj.zInput.body.safeParseAsync(ctxObj.reqData.body);
            validatedFinal.success.body = validated.success;
            validatedFinal.result.body = validated.success
                ? validated.data
                : validated.error;
        }
        return Promise.resolve(validatedFinal);
    }
    ApiController.inputValidate = inputValidate;
    /**
     * Caller for TypeORM Manager create functions
     * @param entityClass TypeORM Entity
     * @param plainObject Plain Object to be an Entity
     * @returns Entity
     */
    function create(entityClass, plainObject) {
        return connections_1.dsm.create(entityClass, plainObject);
    }
    ApiController.create = create;
    /**
     * Async Caller for TypeORM Manager find function
     * @param entityClass TypeORM Entity
     * @param validateResults Output of inputValidate() function
     * @param options TypeORM Options (FindManyOptions)
     * @returns Promise<ValidateResults<TParams, TBody> | Entity[]
     */
    async function findAll(entityClass, validateResults, options) {
        if (validateResults.success.params === false ||
            validateResults.success.body === false)
            return validateResults;
        const dbResult = await connections_1.dsm.find(entityClass, options);
        return dbResult;
    }
    ApiController.findAll = findAll;
    /**
     * Async Caller for TypeORM Manager findOne function
     * @param entityClass TypeORM Entity
     * @param validateResults Output of inputValidate() function
     * @param options TypeORM Options (FindOneOptions)
     * @returns Promise<Entity | ValidateResults<TParams, TBody> | null>
     */
    async function findOne(entityClass, validateResults, options) {
        var _a;
        if (validateResults.success.params === false ||
            validateResults.success.body === false)
            return validateResults;
        // Add id from validated results to the find options if there is no where
        if (!(options === null || options === void 0 ? void 0 : options.where)) {
            options = Object.assign({}, options, {
                where: {
                    id: (_a = validateResults.result.params) === null || _a === void 0 ? void 0 : _a.id,
                },
            });
        }
        const dbResult = await connections_1.dsm
            .findOne(entityClass, options)
            .catch((e) => e);
        return dbResult;
    }
    ApiController.findOne = findOne;
    /**
     * Async Caller for TypeORM Manager Create and Save functions
     * And Use them together to Add to Database
     * @param entityClass TypeORM Entity
     * @param validateResults Output of inputValidate() function
     * @param options? TypeORM Options (SaveOptions)
     * @returns Promise<Entity | ValidateResults<TParams, TBody>>
     */
    async function add(entityClass, validateResults, options) {
        if (validateResults.success.params === false ||
            validateResults.success.body === false)
            return validateResults;
        const newItem = connections_1.dsm.create(entityClass, validateResults.result.body);
        const dbResult = connections_1.dsm.save(entityClass, newItem, options);
        return dbResult;
    }
    ApiController.add = add;
    /**
     * Async Caller for TypeORM Manager Remove function
     * @param entity TypeORM Entity
     * @param validateResults Output of inputValidate() function
     * @param options? TypeORM Options (RemoveOptions)
     * @returns Promise<Entity | ValidateResults<TParams, TBody> | undefined>
     */
    async function remove(targetOrEntity, validateResults, options) {
        if (validateResults.success.params === false ||
            validateResults.success.body === false)
            return validateResults;
        const dbResult = connections_1.dsm.remove(targetOrEntity, validateResults.result.params, options);
        return dbResult;
    }
    ApiController.remove = remove;
    /**
     * Async Caller for TypeORM Manager Save function for Update Values
     * @param entityClass TypeORM Entity
     * @param validateResults Output of inputValidate() function
     * @param options? TypeORM Options (SaveOptions)
     * @returns Promise<Entity | ValidateResults<TParams, TBody>>
     */
    async function update(entityClass, validateResults, options) {
        if (validateResults.success.params === false ||
            validateResults.success.body === false)
            return validateResults;
        // Save needs id, so adding params to body
        const targetEntity = Object.assign({}, validateResults.result.params, validateResults.result.body);
        const dbResult = connections_1.dsm.save(entityClass, targetEntity, options);
        return dbResult;
    }
    ApiController.update = update;
    /**
     * Async Caller for TypeORM Manager Save function to Update Relations
     * @param entityClass TypeORM Entity
     * @param validateResults Output of inputValidate() function
     * @param targetEntity: TypeORM Entity with Updated Relations,
     * @param options? TypeORM Options (SaveOptions)
     * @returns Promise<Entity | ValidateResults<TParams, TBody>>
     */
    async function updateWithTarget(entityClass, validateResults, targetEntity, options) {
        if (validateResults.success.params === false ||
            validateResults.success.body === false)
            return validateResults;
        const dbResult = connections_1.dsm.save(entityClass, targetEntity, options);
        return dbResult;
    }
    ApiController.updateWithTarget = updateWithTarget;
})(ApiController = exports.ApiController || (exports.ApiController = {}));
