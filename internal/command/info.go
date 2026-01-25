package command

import "os/exec"

type CommandInfo struct {
	KubectlPath    string `json:"kubectlPath"`
	KubeloginPath  string `json:"kubeloginPath"`
	KubectlVersion string `json:"kubectlVersion"`
	KubeconfigPath string `json:"kubeconfigPath"`
	Error          string `json:"error"`
	Ready          bool   `json:"ready"`
}

func (c *command) isReady() bool {
	return c.info.KubectlPath != "" && c.info.Error == ""
}

func (c *command) GetInfo() CommandInfo {
	info := CommandInfo{}

	path, err := exec.LookPath(c.cmd)
	if err != nil {
		info.Error = err.Error()
		c.info = info
		return info
	}
	info.KubectlPath = path
	info.KubeconfigPath = kubeconfigPath()

	version, err := c.kubectl("version", "--client", "--short")
	if err != nil {
		info.Error = err.Error()
	} else {
		info.KubectlVersion = version
	}

	kubeloginPath, err := c.findPluginPath("kubectl-oidc_login")
	if err != nil && info.Error == "" {
		info.Error = err.Error()
	}
	info.KubeloginPath = kubeloginPath
	info.Ready = info.KubectlPath != "" && info.Error == ""

	c.info = info
	return info
}
