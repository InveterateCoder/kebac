//go:build !windows && !darwin
// +build !windows,!darwin

package command

import (
	"fmt"
	"os/exec"
)

func setCmdSysProcAttr(cmd *exec.Cmd) {}

func (c *command) OpenTerminal(args ...string) error {
	bin := c.cmd
	if c.info.KubectlPath != "" {
		bin = c.info.KubectlPath
	}
	candidates := []terminalCandidate{
		{name: "x-terminal-emulator", flag: "-e"},
		{name: "gnome-terminal", flag: "--"},
		{name: "konsole", flag: "-e"},
		{name: "xfce4-terminal", flag: "-e"},
		{name: "xterm", flag: "-e"},
		{name: "alacritty", flag: "-e"},
		{name: "kitty", flag: "-e"},
	}

	for _, candidate := range candidates {
		path, err := exec.LookPath(candidate.name)
		if err != nil {
			continue
		}
		cmdArgs := append([]string{candidate.flag, bin}, args...)
		return exec.Command(path, cmdArgs...).Start()
	}

	return fmt.Errorf("no supported terminal emulator found")
}

type terminalCandidate struct {
	name string
	flag string
}
