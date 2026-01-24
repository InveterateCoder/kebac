package command

import "os/exec"

type Command struct{}

func (*Command) GetKubectlPath() (string, error) {
	path, err := exec.LookPath("kubectl")
	if err != nil {
		return "", err
	}
	return path, nil
}
