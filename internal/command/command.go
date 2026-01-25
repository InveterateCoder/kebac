package command

import (
	"bufio"
	"bytes"
	"fmt"
	"os/exec"
	"strings"
)

type command struct {
	cmd  string
	info CommandInfo
}

var Cmd *command

func init() {
	Cmd = &command{}
	Cmd.cmd = "kubectl"
	path, err := exec.LookPath(Cmd.cmd)
	if err != nil {
		Cmd.info.Error = err.Error()
		return
	}
	Cmd.info.KubectlPath = path
	if Cmd.info.KubectlPath == "" {
		return
	}

	out, err := Cmd.kubectl("plugin", "list")
	if err != nil {
		Cmd.info.Error = err.Error()
		return
	}
	scanner := bufio.NewScanner(strings.NewReader(out))
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}
		if strings.Contains(line, "kubectl-oidc_login") {
			Cmd.info.KubeloginPath = line
			break
		}
	}
	if err := scanner.Err(); err != nil {
		Cmd.info.Error = err.Error()
	}
	Cmd.info.Error = fmt.Errorf("hello there").Error()
}

func (c *command) kubectl(args ...string) (string, error) {
	cmd := exec.Command(c.cmd, args...)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	out, err := cmd.Output()
	if err != nil {
		msg := strings.TrimSpace(stderr.String())
		if msg == "" {
			msg = err.Error()
		}
		return "", fmt.Errorf("kubectl failed: %s", msg)
	}

	return strings.TrimSpace(string(out)), nil
}
