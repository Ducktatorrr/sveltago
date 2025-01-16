interface TagoIO {
	ready: () => void;
	onStart: (callback: (widget: any) => void) => void;
	onRealtime: (callback: (data: any) => void) => void;
}

interface Window {
	TagoIO: TagoIO;
}
