import type { Request, Response } from "express";
import { createClient, getAllClients, getClient, getClientById, updateClient } from "../service/client.service.js";
import type { GetClientDto } from "../dto/client.dto.js";

export const createClientController = async (req: Request, res: Response) => {
    try {
        const result = await createClient(req.body);
        res.status(201).json({
            message: "Client created successfully",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            message: "Error creating client",
            error: error.message
        });
    }
}

export const getClientController = async (req: Request, res: Response) => {
    try {
        const result = await getClient(req.query as GetClientDto);
        res.status(200).json({
            message: "Client retrieved successfully",
            data: result
        });
    } catch (error: any) {
        if (error.message == "Client not found") {
            res.status(404).json({
                message: "Client not found",
                error: error.message
            });
        } else {
            res.status(400).json({
                message: "Error retrieving client",
                error: error.message
            });
        }
    }
}

export const getAllClientsController = async (req: Request, res: Response) => {
    try {
        const result = await getAllClients(req.query as GetClientDto)
        return res.status(200).json({
            message: "Clients retrived successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving clients"
        })
    }
}

export const getClientByIdController = async (req: Request, res: Response) => {
    try {
        const clientId = normalizeRouteParam(req.params.id);

        if (!clientId) {
            return res.status(400).json({
                message: "Client id is required"
            });
        }

        const result = await getClientById(clientId);
        return res.status(200).json({
            message: "Client retrieved successfully",
            data: result
        });
    } catch (error: any) {
        if (error.message === "Client not found") {
            return res.status(404).json({
                message: "Client not found",
                error: error.message
            });
        }

        return res.status(400).json({
            message: "Error retrieving client",
            error: error.message
        });
    }
}

export const updateClientController = async (req: Request, res: Response) => {
    try {
        const clientId = normalizeRouteParam(req.params.id);

        if (!clientId) {
            return res.status(400).json({
                message: "Client id is required"
            });
        }

        const result = await updateClient(clientId, req.body);
        return res.status(200).json({
            message: "Client updated successfully",
            data: result
        });
    } catch (error: any) {
        if (error.message === "Client not found") {
            return res.status(404).json({
                message: "Client not found",
                error: error.message
            });
        }

        return res.status(400).json({
            message: "Error updating client",
            error: error.message
        });
    }
}

function normalizeRouteParam(value: string | string[] | undefined) {
    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
}
