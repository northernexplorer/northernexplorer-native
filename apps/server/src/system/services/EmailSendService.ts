import {Resend} from 'resend';
import {config} from '../../config';

interface Send {
	subject: string;
	to: string;
}

export class EmailSendService {
	private resend: Resend;

	constructor() {
		this.resend = new Resend(config.EMAIL_API_KEY);
	}

	async send({to, subject}: Send) {
		try {
			const data = await this.resend.emails.send({
				from: 'noreply@northernexplorer.org',
				to,
				subject,
				html: '<p>Welcome back to the wild.</p>',
			});
			return data;
		} catch (error) {
			console.error('Failed to send email:', error);
			throw error;
		}
	}
}
