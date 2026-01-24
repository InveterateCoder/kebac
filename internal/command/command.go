package command

import "os/exec"

type command struct{}

var Command command = command{}

func (*command) GetKubectlPath() (string, error) {
	path, err := exec.LookPath("kubectl")
	if err != nil {
		return "", err
	}
	return path, nil
}
