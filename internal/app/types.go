package app

type PortForwardRequest struct {
	Context    string `json:"context"`
	Namespace  string `json:"namespace"`
	Pod        string `json:"pod"`
	LocalPort  int    `json:"localPort"`
	RemotePort int    `json:"remotePort"`
}

type ExecRequest struct {
	Context   string `json:"context"`
	Namespace string `json:"namespace"`
	Pod       string `json:"pod"`
	Container string `json:"container"`
	Command   string `json:"command"`
}
