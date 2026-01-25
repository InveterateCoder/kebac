export namespace command {
	
	export class CommandInfo {
	    kubectlPath: string;
	    kubeloginPath: string;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new CommandInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.kubectlPath = source["kubectlPath"];
	        this.kubeloginPath = source["kubeloginPath"];
	        this.error = source["error"];
	    }
	}

}

