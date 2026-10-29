import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {EmailSendService} from '../services/EmailSendService';
import {CaptchaService} from '../../user/services/CaptchaService';

type Route<M extends keyof ROUTES['system']['SupportController']> = RouteDefinition<'system', 'SupportController'>[M];

export class SupportController extends BaseController {
	private emailSendService = new EmailSendService();
	private captchaService = new CaptchaService();

	constructor(repos: Repositories) {
		super(repos);
	}

	async getCaptcha(): Promise<Response<Route<'getCaptcha'>>> {
		return Promise.resolve(this.captchaService.generateCaptcha());
	}

	public async getByUrl(params: Params<Route<'getByUrl'>>): Promise<Response<Route<'getByUrl'>>> {
		const {url} = params;
		return this.repos.support.getByUrl(url);
	}

	getHeadings(): Promise<Response<Route<'getHeadings'>>> {
		return this.repos.support.getHeadings();
	}

	async contact(params: Params<Route<'contact'>>): Promise<Response<Route<'contact'>>> {
		if (params.website) {
			throw new Error('Form submission failed. Please try again.');
		}

		if (!params.name || !params.name.trim()) {
			throw new Error('Please enter your name.');
		}

		if (!params.email || !params.email.trim() || !params.email.includes('@')) {
			throw new Error('Please enter a valid email address.');
		}

		if (!params.subject || !params.subject.trim()) {
			throw new Error('Please enter a subject.');
		}

		if (!params.message || !params.message.trim()) {
			throw new Error('Please enter a message.');
		}

		this.captchaService.verifyCaptcha(params.captchaId, params.captchaAnswer);

		await this.emailSendService.send({
			to: 'support@northernexplorer.org',
			replyTo: params.email.trim().toLowerCase(),
			subject: `Northern Explorer Contact: ${params.subject.trim()}`,
			html: `
				<h2>Northern Explorer Contact Message</h2>
				<p><strong>Name:</strong> ${params.name.trim()}</p>
				<p><strong>Email:</strong> ${params.email.trim().toLowerCase()}</p>
				<p><strong>Subject:</strong> ${params.subject.trim()}</p>
				<p><strong>Message:</strong></p>
				<p style="white-space: pre-wrap;">${params.message.trim()}</p>
			`,
		});

		return {success: true};
	}
}
