package command

import (
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
	Cmd = &command{
		cmd: "kubectl",
	}
}

func (c *command) kubectl(args ...string) (string, error) {
	cmd := exec.Command(c.cmd, args...)
	setCmdSysProcAttr(cmd)

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
