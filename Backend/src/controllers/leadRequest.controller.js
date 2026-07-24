import {
  approveLeadRequest,
  createLeadRequest,
  getMyLeadRequests,
  listLeadRequests,
  rejectLeadRequest,
} from "../services/leadRequest.service.js";

export const requestLead = async (req, res, next) => {
  try {
    const request = await createLeadRequest(req.params.id, req.user);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const requests = await listLeadRequests(req.user);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await getMyLeadRequests(req.user);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (req, res, next) => {
  try {
    const request = await approveLeadRequest(req.params.id, req.user);
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const request = await rejectLeadRequest(req.params.id, req.user);
    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};
