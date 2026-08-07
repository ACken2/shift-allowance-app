/// <reference types="vite/client" />

declare module '*.svg' {
	const src: string;
	export default src;
}

declare module '*.module.css' {
	const classes: { readonly [key: string]: string };
	export default classes;
}

declare module '*.css';

declare module 'ical/ical.js' {
	interface ICalComponent {
		start?: Date;
		summary?: string;
		[key: string]: unknown;
	}

	interface ICalModule {
		parseICS(ics: string): Record<string, ICalComponent>;
	}

	const ical: ICalModule;
	export default ical;
}
