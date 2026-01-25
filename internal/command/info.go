package command

type CommandInfo struct {
	KubectlPath   string `json:"kubectlPath"`
	KubeloginPath string `json:"kubeloginPath"`
	Error         string `json:"error"`
}

func (c *command) isReady() bool {
	return c.info.KubectlPath != "" &&
		c.info.KubeloginPath != "" &&
		c.info.Error == ""
}

func (c *command) GetInfo() CommandInfo {
	return c.info
}
