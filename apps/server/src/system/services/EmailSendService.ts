import {Resend} from 'resend';
import {config} from '../../config';

interface Send {
	subject: string;
	to: string;
	html: string;
	replyTo?: string;
}

export class EmailSendService {
	private resend = new Resend(config.EMAIL_API_KEY);

	constructor() {}

	async send({to, subject, html, replyTo}: Send) {
		try {
			const data = await this.resend.emails.send({
				from: 'noreply@northernexplorer.org',
				to,
				replyTo,
				subject,
				html,
			});
			return data;
		} catch (error) {
			console.error('Failed to send email:', error);
			throw error;
		}
	}
}
