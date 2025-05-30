import { Router, Request, Response } from 'express';
import { ContactService } from '../services/ContactService';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { email, phoneNumber } = req.body;
        const contactService = new ContactService();
        const result = await contactService.identifyContact(email, phoneNumber);
        res.json(result);
    } catch (error) {
        console.error("Error in /identify endpoint:", error);
        res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

export const identifyRouter = router; 