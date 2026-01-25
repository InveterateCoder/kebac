export namespace app {
	
	export class ExecRequest {
	    context: string;
	    namespace: string;
	    pod: string;
	    container: string;
	    command: string;
	
	    static createFrom(source: any = {}) {
	        return new ExecRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.context = source["context"];
	        this.namespace = source["namespace"];
	        this.pod = source["pod"];
	        this.container = source["container"];
	        this.command = source["command"];
	    }
	}
	export class PortForwardRequest {
	    context: string;
	    namespace: string;
	    pod: string;
	    localPort: number;
	    remotePort: number;
	
	    static createFrom(source: any = {}) {
	        return new PortForwardRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.context = source["context"];
	        this.namespace = source["namespace"];
	        this.pod = source["pod"];
	        this.localPort = source["localPort"];
	        this.remotePort = source["remotePort"];
	    }
	}

}

export namespace command {
	
	export class CommandInfo {
	    kubectlPath: string;
	    kubeloginPath: string;
	    kubectlVersion: string;
	    kubeconfigPath: string;
	    error: string;
	    ready: boolean;
	
	    static createFrom(source: any = {}) {
	        return new CommandInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.kubectlPath = source["kubectlPath"];
	        this.kubeloginPath = source["kubeloginPath"];
	        this.kubectlVersion = source["kubectlVersion"];
	        this.kubeconfigPath = source["kubeconfigPath"];
	        this.error = source["error"];
	        this.ready = source["ready"];
	    }
	}

}

