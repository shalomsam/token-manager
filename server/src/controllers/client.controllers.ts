import express from "express";
import { globalConfig } from "../config";
import { ApiResponse } from "../utils/http";
import ClientModel, { Client } from "../models/Client";
import Roles from "../models/Roles";

const { clientUserKey } = globalConfig;

/**
 * Controller Method to get list on Clients
 * 
 * @route GET /api/v1/clients
 * @group Clients
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @returns {object} 200 - Returns a success object and a list of Clients.
 * @returns {object} 401 - Returns a UnAuthorized response statusCode on Error.
 */
export const getClient = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    const clientList = await ClientModel.find({});
    const clientUser = res.locals[clientUserKey];
    if (!clientUser) {
        return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
    }

    if (clientUser.roles !== Roles.Admin) {
        clientList.map((client) => {
            let obj = client.toObject();
            obj['secret'] = '***********';
            return obj;
        });
    }

    return res.status(ApiResponse.OK.statusCode).json({
        ...ApiResponse.OK,
        clientList,
    });
}


/**
 * Controller Method to add new Client
 * 
 * @route POST /api/v1/client
 * @group Clients
 * @param {express.Request} req Express Request
 * @param {express.Response} res Express Response
 * @returns {object|Client} 200 - Returns a success object and a list of Clients.
 * @returns {object} 401 - Returns a UnAuthorized response statusCode on Error.
 */
export const addClient = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    const clientUser = res.locals[clientUserKey];
    if (!clientUser) {
        return res.status(ApiResponse.UNAUTH.statusCode).json(ApiResponse.UNAUTH);
    }
    const client = req.body as Client;
    const newClient = new ClientModel(client);
    const saved = await newClient.save()
    return res.status(ApiResponse.OK.statusCode).json({
        ...ApiResponse.OK,
        client: saved
    });
}
