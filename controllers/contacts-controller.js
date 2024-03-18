import * as contactsService from "../models/contacts/index.js";
import { HttpError } from '../helpers/index.js';
import { conatctAddSchema, conatctUpdateSchema } from "../schemas/contacts-schemas.js";

const getAll = async (req, res, next) => {
	try {
		const result = await contactsService.listContacts();
		res.json(result);
	} catch (error) {
		next(error);
	}
}

const getById = async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const result = await contactsService.getContactById(contactId);
		if (!result) {
			throw HttpError(404, `Not found`);
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}

const add = async (req, res, next) => {
	try {
		const { error } = conatctAddSchema.validate(req.body);
		if (error) {
			throw HttpError(400, error.message);
		}
		const result = await contactsService.addContact(req.body);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
}

const updateById = async (req, res, next) => {
	try {
		const { error } = conatctUpdateSchema.validate(req.body);
		if (error) {
			throw HttpError(400, error.message);
		}
		const { contactId } = req.params;
		const result = await contactsService.updateContact(contactId, req.body);
		if (!result) {
			throw HttpError(404, `Not found`);
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}

const deleteById = async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const result = await contactsService.removeContact(contactId);
		if (!result) {
			throw HttpError(404, `Not found`);
		}
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
}

export default {
	getAll,
	getById,
	add,
	updateById,
	deleteById,
}