import { AppDataSource } from "../data-source";
import { Contact } from "../entities/Contact";

export class ContactService {
    private contactRepository = AppDataSource.getRepository(Contact);

    async identifyContact(email?: string, phoneNumber?: string) {
        if (!email && !phoneNumber) {
            throw new Error("Either email or phoneNumber must be provided");
        }

        // Find all contacts that match either email or phoneNumber
        const existingContacts = await this.contactRepository.find({
            where: [
                { email: email || undefined },
                { phoneNumber: phoneNumber || undefined }
            ],
            order: { createdAt: "ASC" }
        });

        if (existingContacts.length === 0) {
            // Create new primary contact
            const newContact = await this.contactRepository.save({
                email,
                phoneNumber,
                linkPrecedence: "primary"
            });

            return this.formatResponse(newContact, []);
        }

        // Get the primary contact (oldest one)
        const primaryContact = existingContacts.find(c => c.linkPrecedence === "primary") || existingContacts[0];
        const secondaryContacts = existingContacts.filter(c => c.id !== primaryContact.id);

        // Check if we need to create a new secondary contact
        const hasNewInfo = (email && !existingContacts.some(c => c.email === email)) ||
                          (phoneNumber && !existingContacts.some(c => c.phoneNumber === phoneNumber));

        if (hasNewInfo) {
            const newSecondaryContact = await this.contactRepository.save({
                email,
                phoneNumber,
                linkedId: primaryContact.id,
                linkPrecedence: "secondary"
            });
            secondaryContacts.push(newSecondaryContact);
        }

        // Update any primary contacts to secondary if they're not the oldest
        for (const contact of existingContacts) {
            if (contact.id !== primaryContact.id && contact.linkPrecedence === "primary") {
                await this.contactRepository.update(contact.id, {
                    linkPrecedence: "secondary",
                    linkedId: primaryContact.id
                });
            }
        }

        return this.formatResponse(primaryContact, secondaryContacts);
    }

    private formatResponse(primaryContact: Contact, secondaryContacts: Contact[]) {
        const emails = [primaryContact.email, ...secondaryContacts.map(c => c.email)].filter(Boolean) as string[];
        const phoneNumbers = [primaryContact.phoneNumber, ...secondaryContacts.map(c => c.phoneNumber)].filter(Boolean) as string[];
        const secondaryContactIds = secondaryContacts.map(c => c.id);

        return {
            contact: {
                primaryContatctId: primaryContact.id,
                emails: [...new Set(emails)], // Remove duplicates
                phoneNumbers: [...new Set(phoneNumbers)], // Remove duplicates
                secondaryContactIds
            }
        };
    }
} 